import { Metadata } from 'next'
import Changelog from '~/components/changelog/changelog'

export const metadata: Metadata = {
    title: 'Changelog - skowt.cc',
    description: 'View the changelog for skowt.cc.',
}

export default function ChangelogPage() {
    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <div className="flex flex-col gap-6">
                <Changelog />
            </div>
        </div>
    )
}
