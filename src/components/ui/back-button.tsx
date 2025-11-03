'use client'

import { useRouter } from 'next/navigation'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'

export function BackButton({ className }: { className?: string }) {
    const router = useRouter()

    return (
        <div className="bg-card px-3 p-2.5 rounded-lg">
            <Button size="sm" variant={'secondary'} className={className} onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Go Back
            </Button>
        </div>
    )
}
