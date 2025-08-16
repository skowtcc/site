'use client'

import Image from 'next/image'
import { MenuIcon, Download, Eye, CheckSquare } from 'lucide-react'
import { useState } from 'react'

import { SearchForm } from '~/components/search-form'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { useAppSelector, useAppDispatch } from '~/lib/redux/store'
import { setMode } from '~/lib/redux/slices/asset-slice'
import { DownloadPopover } from '~/components/asset/download-popover'
import { AppSidebar } from '~/components/app-sidebar'
import Link from 'next/link'

export function SiteHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useAppDispatch()
    const { selectedAssets, mode } = useAppSelector(state => state.assets)

    const handleModeToggle = () => {
        const newMode = mode === 'view' ? 'multi-select' : 'view'
        dispatch(setMode(newMode))
    }

    return (
        <>
            <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
                <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
                    <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <Button className="h-8 w-8 mr-2" variant="ghost" size="icon">
                            <MenuIcon className="h-4 w-4" />
                        </Button>
                    </AppSidebar>

                    {/* <Link href="/" className="hover:cursor-pointer hover:bg-none px-3 p-2">
                        <div className="flex font-semibold flex-row items-center gap-1">
                            <Image src="/logo.png" alt="skowt.cc" width={24} height={24} />
                        </div>
                    </Link> */}

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        {/* Mode Toggle */}
                        <Button
                            variant={'outline'}
                            size="sm"
                            onClick={handleModeToggle}
                            className="flex items-center gap-2"
                        >
                            {mode === 'view' ? (
                                <>
                                    <Eye className="h-4 w-4" />
                                    <span className="text-sm">Mode: View</span>
                                </>
                            ) : (
                                <>
                                    <CheckSquare className="h-4 w-4" />
                                    <span className="text-sm">Mode: Multi-Select</span>
                                </>
                            )}
                        </Button>

                        {selectedAssets.length > 0 && (
                            <>
                                <Separator orientation="vertical" className="h-6" />

                                {/* Download Popover */}
                                <DownloadPopover>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span className="text-sm">{selectedAssets.length}</span>
                                    </Button>
                                </DownloadPopover>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}
