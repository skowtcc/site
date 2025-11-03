'use client'

import * as React from 'react'
import { type LucideIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'

export function NavSecondary({
    items,
    className,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
    className?: string
}) {
    // const { setTheme, theme } = useTheme()

    return (
        <div className={className}>
            <div className="space-y-2">
                {items.map(item => (
                    <Button key={item.title} variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <a href={item.url}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </a>
                    </Button>
                ))}
                {/* <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start hover:cursor-pointer"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="ml-1">Toggle theme</span>
                    </div>
                </Button> */}
            </div>
        </div>
    )
}
