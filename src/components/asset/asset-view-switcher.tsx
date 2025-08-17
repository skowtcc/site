'use client'

import { useAssetContext } from './asset-context'
import { Button } from '../ui/button'
import { HiViewGrid, HiViewList } from 'react-icons/hi'

export function AssetViewSwitcher() {
    const { viewMode, setViewMode } = useAssetContext()

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Search Assets</h2>
            </div>
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
                    <HiViewGrid size={16} />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>
                    <HiViewList size={16} />
                </Button>
            </div>
        </div>
    )
}
