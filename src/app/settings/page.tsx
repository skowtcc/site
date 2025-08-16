import { Metadata } from 'next'
import { HomeIcon } from 'lucide-react'
import { ProfileSettingsForm } from '~/components/settings/profile-settings-form'
import { LocalSettingsForm } from '~/components/settings/local-settings-form'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

export const metadata: Metadata = {
    title: 'Settings - skowt.cc',
    description: 'Manage your account settings and preferences.',
}

export default function SettingsPage() {
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
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
                </div>

                <div className="space-y-6">
                    <ProfileSettingsForm />
                    <LocalSettingsForm />
                </div>
            </div>
        </div>
    )
}
