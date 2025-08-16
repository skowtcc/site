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
import { DownloadHistoryList } from '~/components/download-history/download-history-list'

export const metadata: Metadata = {
    title: 'Download History - skowt.cc',
    description: 'View and manage your download history.',
}

export default function DownloadHistoryPage() {
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
                            <BreadcrumbPage>Download History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Download History</h1>
                    <p className="text-muted-foreground mt-2">View and manage your download history.</p>
                </div>

                <DownloadHistoryList />
            </div>
        </div>
    )
}
