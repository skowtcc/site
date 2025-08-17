import { Metadata } from 'next'
import { HomeIcon } from 'lucide-react'
import { ProfileSettingsForm } from '~/components/settings/profile-settings-form'
import { LocalSettingsForm } from '~/components/settings/local-settings-form'

export const metadata: Metadata = {
    title: 'Settings - skowt.cc',
    description: 'Manage your account settings and preferences.',
}

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <div className="flex flex-col gap-6">
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
