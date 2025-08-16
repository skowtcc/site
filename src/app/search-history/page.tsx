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

export const metadata: Metadata = {
    title: 'Search History - skowt.cc',
    description: 'View and manage your search history.',
}

export default function SearchHistoryPage() {
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
                            <BreadcrumbPage>Search History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Search History</h1>
                    <p className="text-muted-foreground mt-2">View and manage your search history.</p>
                </div>
            </div>
        </div>
    )
}
