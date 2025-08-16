
import { SearchPage } from '~/components/asset/search-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'skowt.cc',
    description: "Comprehensive game asset database that's community-driven and free for everyone.",
}

export default function Page() {
    return (
        <div className="flex flex-col">
            <SearchPage />
        </div>
    )
}
