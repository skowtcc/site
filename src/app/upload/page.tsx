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
import { AssetUploadForm } from '~/components/asset/asset-upload-form'

export const metadata: Metadata = {
    title: 'Upload - skowt.cc',
    description: 'Upload assets to skowt.cc.',
}

export default function UploadPage() {
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
                            <BreadcrumbPage>Upload</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Upload</h1>
                    <p className="text-muted-foreground mt-2">Upload assets to skowt.cc.</p>
                </div>
                <AssetUploadForm />
            </div>
        </div>
    )
}
