'use client'

import { HiMenu, HiDownload } from 'react-icons/hi'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useAppSelector, useAppDispatch } from '~/lib/redux/store'
import { setMode } from '~/lib/redux/slices/asset-slice'
import { DownloadPopover } from '~/components/asset/download-popover'
import { AppSidebar } from '~/components/app-sidebar'
import Link from 'next/link'
import { RiDiscordLine } from 'react-icons/ri'
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
        <div className="px-6 py-2 pt-4 flex flex-col gap-2">
            <header className="bg-card sticky top-0 z-50 flex w-full items-center border rounded-xl">
                <div className="flex h-(--header-height) w-full items-center gap-2 px-6">
                    <Link href="/" className="">
                        <Image src="/logo.png" alt="Skowt Logo" width={32} height={32} className="h-8 w-8" />
                    </Link>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant={'secondary'}
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

                        <Link href="https://discord.gg/noid " target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" size="sm" className="flex flex-row items-center gap-2">
                                <RiDiscordLine size={16} />
                            </Button>
                        </Link>

                        {selectedAssets.length > 0 && (
                            <>
                                <DownloadPopover>
                                    <Button variant="secondary" size="sm" className="flex flex-row items-center gap-2">
                                        <HiDownload size={16} />
                                        <span className="text-sm">{selectedAssets.length}</span>
                                    </Button>
                                </DownloadPopover>
                            </>
                        )}

                        <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <Button size="sm">
                                <HiMenu size={16} />
                            </Button>
                        </AppSidebar>
                    </div>
                </div>
            </header>
        </div>
    )
}
