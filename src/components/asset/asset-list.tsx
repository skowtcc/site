'use client'

import { useAssetContext } from './asset-context'
import { AssetItem } from './asset-item'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { Loader2 } from 'lucide-react'

export function AssetList() {
    const { assets, pagination, loadMore, loadingMore } = useAssetContext()

    useInfiniteScroll({
        hasNextPage: pagination?.hasNext ?? false,
        loadMore,
        isLoading: loadingMore,
        threshold: 300,
    })

    return (
        <div className="h-full overflow-y-auto">
            <div className="space-y-3 flex flex-col">
                {assets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} variant="list" />
                ))}

                {loadingMore && (
                    <div className="flex justify-center items-center py-8">
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-muted-foreground">Loading more assets...</span>
                        </div>
                    </div>
                )}

                {pagination && !pagination.hasNext && assets.length > 0 && (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-muted-foreground">You've reached the end of the list</p>
                    </div>
                )}
            </div>
        </div>
    )
}
