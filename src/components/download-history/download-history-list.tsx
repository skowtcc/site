'use client'

import { useEffect, useState, useCallback } from 'react'
import { authClient } from '~/lib/auth/auth-client'
import { client } from '~/lib/api/client'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Loader2, Calendar, Package, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { useAppDispatch } from '~/lib/redux/store'
import { setSelectedAssets } from '~/lib/redux/slices/asset-slice'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DownloadHistoryList() {
    const [downloadHistory, setDownloadHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)
    
    const { data: session } = authClient.useSession()
    const user = session?.user
    const dispatch = useAppDispatch()
    const router = useRouter()

    const fetchDownloadHistory = useCallback(async () => {
        if (!user) return
        
        setLoading(true)
        try {
            const response = await client.get(`/user/download-history`, {
                query: { 
                    page: page.toString(),
                    limit: '20'  // Default 20, max 50
                }
            })
            
            setDownloadHistory(response.downloadHistory)
            setPagination(response.pagination)
        } catch (error) {
            console.error('Failed to fetch download history:', error)
            toast.error('Failed to load download history')
        } finally {
            setLoading(false)
        }
    }, [user, page])

    useEffect(() => {
        fetchDownloadHistory()
    }, [fetchDownloadHistory])

    const handleRedownload = (assets: any[]) => {
        // Replace current selection with this batch
        dispatch(setSelectedAssets(assets))
        toast.success(`Selected ${assets.length} assets for download`, {
            description: 'Navigate to any asset page to access the download popover',
            action: {
                label: 'Go to assets',
                onClick: () => router.push('/')
            }
        })
    }

    const formatFileSize = (sizeInBytes: number) => {
        const sizeInMB = sizeInBytes / (1024 * 1024)
        if (sizeInMB < 1) {
            const sizeInKB = sizeInBytes / 1024
            return `${Math.round(sizeInKB)}KB`
        }
        return `${sizeInMB.toFixed(1)}MB`
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
                    <p className="text-muted-foreground">You must be logged in to view your download history.</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (downloadHistory.length === 0) {
        return (
            <div className="text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
                <div>
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">No download history</p>
                    <p className="text-sm">Your download history will appear here once you download assets.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {downloadHistory.map((historyItem) => (
                <div key={historyItem.historyId} className="bg-card border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Downloaded {formatDistanceToNow(new Date(historyItem.downloadedAt), { addSuffix: true })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {historyItem.assets.length} {historyItem.assets.length === 1 ? 'asset' : 'assets'}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRedownload(historyItem.assets)}
                                className="gap-2"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Re-select for Download
                            </Button>
                        </div>
                    </div>

                    {/* Asset Preview Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {historyItem.assets.slice(0, 12).map((asset: any) => (
                            <div key={asset.id} className="group relative">
                                <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                                    <Image
                                        src={`https://pack.skowt.cc/cdn-cgi/image/width=200,quality=70/asset/${asset.id}.${asset.extension}`}
                                        alt={asset.name}
                                        width={200}
                                        height={200}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <div className="mt-1">
                                    <p className="text-xs truncate" title={asset.name}>
                                        {asset.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(asset.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {historyItem.assets.length > 12 && (
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-semibold text-muted-foreground">
                                        +{historyItem.assets.length - 12}
                                    </p>
                                    <p className="text-xs text-muted-foreground">more</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total Size */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Total size: {formatFileSize(historyItem.assets.reduce((sum: number, asset: any) => sum + asset.size, 0))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {/* Show unique games */}
                            {Array.from(new Set(historyItem.assets.map((a: any) => a.gameSlug))).slice(0, 3).map((gameSlug: any) => {
                                const game = historyItem.assets.find((a: any) => a.gameSlug === gameSlug)
                                return (
                                    <Badge key={gameSlug} variant="outline" className="text-xs gap-1">
                                        <Image
                                            src={`https://pack.skowt.cc/cdn-cgi/image/width=32,height=32,quality=75/game/${gameSlug}-icon.png`}
                                            alt={game.gameName}
                                            width={14}
                                            height={14}
                                            className="rounded"
                                        />
                                        {game.gameName}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrev}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNext}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}