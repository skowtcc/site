'use client'

import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'

export function OriginoidPromoDialog() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('originoid-promo-dismissed')
        if (!dismissed) {
            setIsOpen(true)
        }
    }, [])
    const handlePreregister = () => {
        window.open('https://originoid.co', '_blank')
        setIsOpen(false)
    }

    const handleDontShowAgain = () => {
        localStorage.setItem('originoid-promo-dismissed', 'true')
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center">
                        OC Creator, Artist or Creative?
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <p className="text-center text-sm text-muted-foreground leading-relaxed">
                        The team behind <span className="font-medium text-foreground">skowt.cc</span> are making{' '}
                        <span className="font-medium text-foreground">Originoid</span>, a{' '}
                        <span className="font-semibold text-foreground">NO AI</span> platform to share and link your
                        original characters, videos, audios, artwork & images with advanced customization and full
                        protection against AI, theft and misuse. Releasing Nov 1st 2025.
                    </p>
                </div>

                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={handlePreregister} className="flex-1 sm:flex-none flex items-center gap-2">
                        Join the Waitlist
                    </Button>
                    <Button variant="outline" onClick={handleDontShowAgain} className="flex-1 sm:flex-none">
                        Don't show again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
