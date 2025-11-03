'use client'

import { useAssetContext } from './asset-context'
import { AssetItem } from './asset-item'
import { useInfiniteScroll } from '~/hooks/use-infinite-scroll'
import { Loader2 } from 'lucide-react'
import Masonry from 'react-masonry-css'

export function AssetGrid() {
    const { assets, pagination, loadMore, loadingMore } = useAssetContext()

    useInfiniteScroll({
        hasNextPage: pagination?.hasNext ?? false,
        loadMore,
        isLoading: loadingMore,
        threshold: 300,
    })

    const breakpointColumns = {
        default: 4,
        1280: 3,
        500: 2,
    }

    return (
        <div className="h-full overflow-y-auto">
            <div>
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {assets.map(asset => (
                        <AssetItem key={asset.id} asset={asset} />
                    ))}
                </Masonry>

                {loadingMore && (
                    <div className="flex justify-center items-center py-8">
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}

                {pagination && !pagination.hasNext && assets.length > 0 && (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-foreground">You've reached the end of the list</p>
                    </div>
                )}
            </div>
        </div>
    )
}
