'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { EyeOffIcon } from 'lucide-react'

const LOCAL_STORAGE_KEY = 'showSuggestiveContent'

interface AssetImageProps {
    assetId: string
    extension: string
    name: string
    isSuggestive: boolean
    className?: string
}

export function AssetImage({ assetId, extension, name, isSuggestive, className }: AssetImageProps) {
    const [showSuggestive, setShowSuggestive] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored !== null) {
            setShowSuggestive(stored === 'true')
        }
    }, [])

    return (
        <div className={`relative ${className}`}>
            <Image
                src={`https://pack.skowt.cc/asset/${assetId}.${extension}`}
                alt={name}
                fill
                className={`object-contain ${isSuggestive && !showSuggestive ? 'blur-lg' : ''}`}
            />

            {isSuggestive && !showSuggestive && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-lg flex items-center justify-center">
                    <div className="flex flex-col text-center items-center px-4">
                        <EyeOffIcon size={32} className="mb-3" />
                        <p className="text-base font-medium text-foreground">Potentially Suggestive Content</p>
                        <p className="text-sm text-muted-foreground">Please enable in settings to view</p>
                    </div>
                </div>
            )}
        </div>
    )
}
