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
import Changelog from '~/components/changelog/changelog'

export const metadata: Metadata = {
    title: 'Changelog - skowt.cc',
    description: 'View the changelog for skowt.cc.',
}

export default function ChangelogPage() {
    return (
        <div className="flex flex-col gap-  4 p-6 min-h-screen">
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
                            <BreadcrumbPage>Changelog</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Changelog</h1>
                    <p className="text-muted-foreground mt-2">View the changelog for skowt.cc.</p>
                </div>
                <Changelog />
            </div>
        </div>
    )
}
