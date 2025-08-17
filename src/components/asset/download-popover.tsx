'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '~/lib/redux/store'
import { clearSelectedAssets, toggleAssetSelection, setIsMassDownloading } from '~/lib/redux/slices/asset-slice'
import { downloadAssetsAsZip } from '~/lib/mass-download'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Download, MinusIcon, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
// import { useAuth } from '~/components/auth/auth-context'
import { authClient } from '~/lib/auth/auth-client'
import { client } from '~/lib/api/client'

interface DownloadProgress {
    current: number
    total: number
    currentAsset: string
    status: 'downloading' | 'zipping' | 'complete' | 'error'
}

interface DownloadPopoverProps {
    children: React.ReactNode
}

export function DownloadPopover({ children }: DownloadPopoverProps) {
    const dispatch = useAppDispatch()
    const { selectedAssets, isMassDownloading } = useAppSelector(state => state.assets)
    const [progress, setProgress] = useState<DownloadProgress | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const { data: session } = authClient.useSession()
    const isAuthenticated = !!session?.user
    const user = session?.user

    const handleMassDownload = async () => {
        if (selectedAssets.length === 0) return

        dispatch(setIsMassDownloading(true))
        setProgress({
            current: 0,
            total: selectedAssets.length,
            currentAsset: '',
            status: 'downloading',
        })

        try {
            await downloadAssetsAsZip(selectedAssets, setProgress)
            toast.success(`Successfully downloaded ${selectedAssets.length} assets!`)
            dispatch(clearSelectedAssets())
            setIsOpen(false)
            if (isAuthenticated && user) {
                await client.post('/asset/history', {
                    body: {
                        assetIds: selectedAssets.map(a => a.id),
                    },
                })
            }
        } catch (error) {
            console.error('Mass download failed:', error)
            toast.error('Failed to download assets. Please try again.')
        } finally {
            dispatch(setIsMassDownloading(false))
            setProgress(null)
        }
    }

    const handleClearAll = () => {
        dispatch(clearSelectedAssets())
        setIsOpen(false)
    }

    const handleRemoveAsset = (assetId: string) => {
        const asset = selectedAssets.find(a => a.id === assetId)
        if (asset) {
            dispatch(toggleAssetSelection(asset))
        }
    }

    const getProgressPercentage = () => {
        if (!progress) return 0
        return Math.round((progress.current / progress.total) * 100)
    }

    const getStatusText = () => {
        if (!progress) return ''

        switch (progress.status) {
            case 'downloading':
                return `Downloading ${progress.currentAsset || 'assets'}... (${progress.current}/${progress.total})`
            case 'zipping':
                return 'Creating ZIP file...'
            case 'complete':
                return 'Download complete!'
            case 'error':
                return 'Download failed'
            default:
                return ''
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-96 p-0 bg-card border" align="end">
                {}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">
                            {selectedAssets.length} asset
                            {selectedAssets.length !== 1 ? 's' : ''} selected
                        </span>
                        {selectedAssets.length >= 450 && (
                            <span className="text-xs text-muted-foreground">
                                {selectedAssets.length >= 500 
                                    ? 'Maximum limit reached (500)'
                                    : `Approaching limit (${selectedAssets.length}/500)`
                                }
                            </span>
                        )}
                    </div>
                    {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={isMassDownloading}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button> */}

                    {}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        disabled={isMassDownloading}
                        className="h-6 w-6 p-0"
                    >
                        <MinusIcon className="h-3 w-3" />
                    </Button>
                </div>

                {}
                {isMassDownloading && progress && (
                    <div className="p-4 border-b bg-muted/50">
                        <div className="space-y-2">
                            <Progress value={getProgressPercentage()} className="h-2" />
                            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
                        </div>
                    </div>
                )}

                {}
                <ScrollArea className="max-h-48">
                    {selectedAssets.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <p>No assets selected</p>
                        </div>
                    ) : (
                        <div className="p-2 max-h-48 overflow-y-auto">
                            {selectedAssets.map((asset, index) => (
                                <div
                                    key={asset.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={`https://pack.skowt.cc/asset/${asset.id}.${asset.extension}`}
                                            alt={asset.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {asset.gameName} {asset.categoryName}
                                        </p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAsset(asset.id)}
                                        disabled={isMassDownloading}
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t flex flex-row gap-2 w-full">
                    <Button
                        onClick={handleMassDownload}
                        disabled={isMassDownloading || selectedAssets.length === 0}
                        className="flex-1 flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {isMassDownloading ? 'Downloading...' : 'Download Assets'}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleClearAll}
                        disabled={isMassDownloading || selectedAssets.length === 0}
                        className="h-9 w-9 p-0 flex-shrink-0"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
