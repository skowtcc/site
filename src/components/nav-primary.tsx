'use client'

import type { LucideIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth/auth-client'

type NavItem = {
    name: string
    url: string
    icon: any // LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>
    requiresLogin?: boolean
    requiresContributor?: boolean
}

type SectionHeader = {
    title: string
}

type NavPrimaryItem = NavItem | SectionHeader

export function NavPrimary({ items }: { items: NavPrimaryItem[] }) {
    const router = useRouter()

    const { data: session, error, isPending } = authClient.useSession()

    if (error) {
        console.error('Error fetching user session:', error)
        return null
    }

    return (
        <div className="space-y-2">
            {items.map((item, index) => {
                if ('title' in item) {
                    return (
                        <h3 key={`header-${index}`} className="text-sm font-medium text-muted-foreground px-3 py-2">
                            {item.title}
                        </h3>
                    )
                }

                return (
                    <Button
                        key={item.name}
                        disabled={
                            (item.requiresLogin && !session?.user) ||
                            (item.requiresContributor && session?.user?.role === 'user')
                        }
                        variant="ghost"
                        className={`w-full justify-start hover:cursor-pointer ${(item.requiresLogin && !session?.user) || (item.requiresContributor && session?.user?.role === 'user') ? 'opacity-50' : ''}`}
                        asChild
                        onClick={() => {
                            if (item.requiresLogin && !session?.user) {
                                return
                            } else if (item.requiresContributor && session?.user?.role === 'user') {
                                return
                            } else {
                                router.push(item.url)
                            }
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.name}</span>
                        </div>
                    </Button>
                )
            })}
        </div>
    )
}
