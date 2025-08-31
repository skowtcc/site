'use client'

import { useState, useEffect } from 'react'
import { UnifiedAssetList } from '~/components/asset/unified-asset-list'
import { OriginoidPromoDialog } from '~/components/ui/originoid-promo-dialog'

export default function Page() {
    const [showPromoDialog, setShowPromoDialog] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('originoid-promo-dismissed')
        if (!dismissed) {
            setShowPromoDialog(true)
        }
    }, [])

    return (
        <div className="flex flex-col p-6 min-h-screen">
            <UnifiedAssetList endpoint="/asset/search" />
            <OriginoidPromoDialog isOpen={showPromoDialog} onClose={() => setShowPromoDialog(false)} />
        </div>
    )
}
