import { Metadata } from 'next'
import { HomeIcon } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { UnifiedAssetList } from '~/components/asset/unified-asset-list'

export const metadata: Metadata = {
    title: 'Saved Assets - skowt.cc',
    description: 'View and manage your saved assets.',
}

export default function SavedAssetsPage() {
    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <div className="flex flex-col gap-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">
                                <HomeIcon className="h-4 w-4" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Saved Assets</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Saved Assets</h1>
                    <p className="text-muted-foreground mt-2">View and manage your saved assets.</p>
                </div>

                <UnifiedAssetList endpoint="/user/saved-assets" requireAuth={true} />
            </div>
        </div>
    )
}
