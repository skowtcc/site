import { AssetProvider } from './asset-context'
import { AssetFilters } from './asset-filters'
import { AssetViewSwitcher } from './asset-view-switcher'
import { AssetContent } from './asset-content'
import { Banner } from '../main/banner'
import { RecentlyUploadedCarousel } from '~/components/main/recently-uploaded-carousel'

export function SearchPage() {
    return (
        <AssetProvider>
            <div className="flex flex-col">
                <div className="flex flex-col gap-8 pt-6">
                    {/* <Banner /> */}
                    <RecentlyUploadedCarousel />
                </div>
            </div>
            <div className="flex flex-col px-6 min-h-screen">
                <AssetViewSwitcher />
                <div className="flex flex-col 2xl:flex-row h-full gap-6 pt-4">
                    <div className="2xl:w-80 w-full flex-shrink-0">
                        <AssetFilters />
                    </div>
                    <AssetContent />
                </div>
            </div>
        </AssetProvider>
    )
}
