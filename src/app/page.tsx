import { Metadata } from 'next'
import { UnifiedAssetList } from '~/components/asset/unified-asset-list'

export const metadata: Metadata = {
    title: 'skowt.cc',
    description:
        "Comprehensive game asset database that's community-driven and free for everyone. Previously known as wanderer.moe.",
}

export default function Page() {
    return (
        <div className="flex flex-col p-6 min-h-screen">
            <UnifiedAssetList endpoint="/asset/search" />
        </div>
    )
}
