'use client'

import { HiMenu, HiDownload } from 'react-icons/hi'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useAppSelector, useAppDispatch } from '~/lib/redux/store'
import { setMode } from '~/lib/redux/slices/asset-slice'
import { DownloadPopover } from '~/components/asset/download-popover'
import { AppSidebar } from '~/components/app-sidebar'
import Link from 'next/link'
import Image from 'next/image'

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
            <Link href="https://discord.gg/noid" target="_blank" rel="noreferrer">
                <div className="bg-cyan-400/10 border-b border-cyan-400/20 text-cyan-400 p-3 text-sm text-center hover:bg-cyan-400/20 transition-colors cursor-pointer duration-150">
                    wanderer.moe is now skowt.cc with a completely new site!
                </div>
            </Link>
            <header className="bg-card sticky top-0 z-50 flex w-full items-center border-b">
                <div className="flex h-(--header-height) w-full items-center gap-2 px-6">
                    <Link href="/" className="">
                        <Image src="/logo.png" alt="Skowt Logo" width={32} height={32} className="h-8 w-8" />
                    </Link>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant={'outline'}
                            size="sm"
                            onClick={handleModeToggle}
                            className="flex flex-row items-center gap-2"
                        >
                            {mode === 'view' ? (
                                <>
                                    <span className="text-sm">Mode: View</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm">Mode: Multi-Select</span>
                                </>
                            )}
                        </Button>

                        {selectedAssets.length > 0 && (
                            <>
                                <DownloadPopover>
                                    <Button variant="outline" size="sm" className="flex flex-row items-center gap-2">
                                        <HiDownload size={16} />
                                        <span className="text-sm">{selectedAssets.length}</span>
                                    </Button>
                                </DownloadPopover>
                            </>
                        )}

                        <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <Button variant="secondary" size="sm">
                                <HiMenu size={16} />
                            </Button>
                        </AppSidebar>
                    </div>
                </div>
            </header>
        </>
    )
}
