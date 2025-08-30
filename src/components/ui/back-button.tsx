'use client'

import { useRouter } from 'next/navigation'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'

export function BackButton({ className }: { className?: string }) {
    const router = useRouter()

    return (
        <Button size="sm" variant="outline" className={className} onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Go Back
        </Button>
    )
}
