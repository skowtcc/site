import { Metadata } from 'next'
import { UnifiedAssetList } from '~/components/asset/unified-asset-list'

export const metadata: Metadata = {
    title: 'skowt.cc',
    description: "Comprehensive game asset database that's community-driven and free for everyone.",
}

export default function Page() {
    return (
        <div className="flex flex-col p-6 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Asset Library</h1>
                <p className="text-muted-foreground mt-2">Browse and download assets across a wide variety of games.</p>
            </div>
            
            <UnifiedAssetList 
                endpoint="/asset/search"
            />
        </div>
    )
}
