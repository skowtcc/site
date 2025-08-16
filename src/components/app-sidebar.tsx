'use client'

import * as React from 'react'
import {
    GitBranchIcon,
    HeartIcon,
    HomeIcon,
    Settings2Icon,
    UsersIcon,
    DownloadIcon,
    ListPlusIcon,
    UploadIcon,
} from 'lucide-react'
import { NavPrimary } from '~/components/nav-primary'
import { NavSecondary } from '~/components/nav-secondary'
import { NavUser } from '~/components/nav-user'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
// import { authClient } from '~/lib/auth/auth-client'

const navData = {
    navSecondary: [
        {
            title: 'Discord',
            url: 'https://discord.gg/noid',
            icon: UsersIcon,
        },
        {
            title: 'GitHub',
            url: 'https://github.com/skowtcc',
            icon: GitBranchIcon,
        },
    ],
    navigation: [
        {
            title: 'Navigation',
        },
        {
            name: 'Home',
            url: '/',
            icon: HomeIcon,
        },
        {
            name: 'Download History',
            url: '/download-history',
            icon: DownloadIcon,
            requiresLogin: true,
        },
        {
            name: 'Saved Assets',
            url: '/saved',
            icon: HeartIcon,
            requiresLogin: true,
        },
        {
            name: 'Upload',
            url: '/upload',
            icon: UploadIcon,
            requiresLogin: true,
            requiresContributor: true,
        },
        {
            name: 'Changelog',
            url: '/changelog',
            icon: ListPlusIcon,
        },
        {
            name: 'Settings',
            url: '/settings',
            icon: Settings2Icon,
        },
    ],
}

interface AppSidebarProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AppSidebar({ children, open, onOpenChange }: AppSidebarProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
                <SheetHeader>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="flex-1 p-4">
                        <NavPrimary items={navData.navigation} />
                        <div className="mt-auto pt-8">
                            <NavSecondary items={navData.navSecondary} />
                        </div>
                    </div>
                    <div className="border-t p-4">
                        <NavUser />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
