'use client'

import { useAssetContext } from './asset-context'
import { AssetGrid } from './asset-grid'
import { AssetList } from './asset-list'
import { Button } from '~/components/ui/button'
import { Loader2 } from 'lucide-react'

export function AssetContent() {
    const { viewMode, loading, error, assets, pagination, updateFilter } = useAssetContext()

    if (error) {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Error loading assets: {error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        )
    }

    if (loading && !assets.length) {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading assets...</span>
                </div>
            </div>
        )
    }

    if (!assets.length && !loading) {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No assets found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
            </div>
        )
    }

    return <div className="flex-1 min-h-0 space-y-4">{viewMode === 'grid' ? <AssetGrid /> : <AssetList />}</div>
}
