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
    const [loadingMore, setLoadingMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const { data: session } = authClient.useSession()
    const user = session?.user
    const dispatch = useAppDispatch()
    const router = useRouter()

    const fetchDownloadHistory = useCallback(
        async (isLoadMore = false) => {
            if (!user) return
            if (!hasMore && isLoadMore) return

            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            try {
                const response = await client.get(`/user/download-history`, {
                    query: {
                        offset: (isLoadMore ? offset : 0).toString(),
                    },
                })

                if (isLoadMore) {
                    // Filter out duplicates when appending
                    setDownloadHistory(prev => {
                        const existingIds = new Set(prev.map(h => h.historyId))
                        const uniqueNewHistory = response.downloadHistory.filter(
                            (item: any) => !existingIds.has(item.historyId),
                        )
                        return [...prev, ...uniqueNewHistory]
                    })
                    setOffset(prev => prev + 20)
                } else {
                    setDownloadHistory(response.downloadHistory)
                    setOffset(0)
                }

                setHasMore(response.pagination?.hasNext || false)
            } catch (error) {
                console.error('Failed to fetch download history:', error)
                toast.error('Failed to load download history')
            } finally {
                setLoading(false)
                setLoadingMore(false)
            }
        },
        [user, offset, hasMore],
    )

    useEffect(() => {
        fetchDownloadHistory(false)
    }, [user])

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore || loading) return

            const scrollPosition = window.innerHeight + window.scrollY
            const documentHeight = document.documentElement.offsetHeight

            // Load more when user is 200px from the bottom
            if (scrollPosition >= documentHeight - 200) {
                fetchDownloadHistory(true)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [loadingMore, hasMore, loading, fetchDownloadHistory])

    const handleRedownload = (assets: any[]) => {
        // Replace current selection with this batch
        dispatch(setSelectedAssets(assets))
        toast.success(`Reselected ${assets.length} assets for download`, {
            description: 'You can download them from the top right corner.',
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
        return null
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
            {downloadHistory.map(historyItem => (
                <div key={historyItem.historyId} className="bg-card border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Downloaded{' '}
                                {formatDistanceToNow(new Date(historyItem.downloadedAt), { addSuffix: true })}
                            </span>
                        </div>
                        <Badge variant="secondary">
                            {historyItem.assets.length} {historyItem.assets.length === 1 ? 'asset' : 'assets'}
                        </Badge>
                    </div>

                    {/* Asset Preview - First 5 small, rest hidden with count */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {historyItem.assets.slice(0, 5).map((asset: any, index: number) => (
                                <div
                                    key={asset.id}
                                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted"
                                    style={{ zIndex: 5 - index }}
                                >
                                    <Image
                                        src={`https://pack.skowt.cc/cdn-cgi/image/width=100,quality=70/asset/${asset.id}.${asset.extension}`}
                                        alt={asset.name}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                            {historyItem.assets.length > 5 && (
                                <div
                                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center"
                                    style={{ zIndex: 0 }}
                                >
                                    <span className="text-xs font-medium text-muted-foreground">
                                        +{historyItem.assets.length - 5}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Size and Reselect */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Total size:{' '}
                            {formatFileSize(
                                historyItem.assets.reduce((sum: number, asset: any) => sum + asset.size, 0),
                            )}
                        </div>
                        <Button size="sm" onClick={() => handleRedownload(historyItem.assets)} className="gap-2">
                            <RotateCcw className="h-3 w-3" />
                            Reselect
                        </Button>
                    </div>
                </div>
            ))}

            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading more history...</span>
                </div>
            )}
        </div>
    )
}
