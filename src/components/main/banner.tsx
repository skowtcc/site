import { DownloadIcon, FileIcon, Gamepad2Icon } from 'lucide-react'
import Image from 'next/image'
import { AnimatedNumber } from '../ui/animated-number'

const bgImage = 'https://i.ytimg.com/vi/sgVe7QYBGBU/maxresdefault.jpg'

export function Banner() {
    return (
        <div className="relative flex flex-col gap-2 shadow border rounded-lg m-6 mb-2">
            <div className="relative w-full h-72 sm:h-64">
                <img
                    src={bgImage}
                    alt="skowt.cc"
                    className="rounded-lg object-cover object-offset-center w-full h-full opacity-75"
                />
                <div className="absolute inset-0 flex flex-col gap-2 justify-center items-center text-center bg-black/50 rounded-lg backdrop-blur-md">
                    <h1 className="text-4xl font-semibold">skowt.cc</h1>
                    <h2 className="text-lg">
                        Comprehensive game asset database that's community-driven and free for everyone.
                    </h2>
                    <SiteStats />
                </div>
            </div>
        </div>
    )
}

type SiteStat = {
    title: string
    value: number | string
    icon: React.ReactNode
}

// todo, once this site is out for a while, we can add real data. manual is fine for now.
const manualSiteStats = [
    {
        title: 'Assets',
        value: '13K+',
        icon: <FileIcon size={16} />,
    },
    {
        title: 'Downloads',
        value: '1B+',
        icon: <DownloadIcon size={16} />,
    },
    {
        title: 'Games',
        value: '15',
        icon: <Gamepad2Icon size={16} />,
    },
]

function SiteStats() {
    return (
        <div className="flex flex-row gap-8 mt-4 bg-card/70 p-2 px-6 rounded-lg border shadow-sm">
            {manualSiteStats.map((stat: SiteStat) => (
                <div className="flex flex-col items-center" key={stat.title}>
                    <div className="flex flex-row items-center gap-2">
                        {stat.icon}
                        <span>{stat.value}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.title}</span>
                </div>
            ))}
        </div>
    )
}
