import { useState, useCallback } from 'react'

type ToastVariant = 'default' | 'destructive'

interface Toast {
    title: string
    description?: string
    variant?: ToastVariant
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((newToast: Toast) => {
        // For now, just log to console
        // In a real implementation, this would show a toast notification
        if (newToast.variant === 'destructive') {
            console.error(`[Toast Error] ${newToast.title}: ${newToast.description || ''}`)
        } else {
            console.log(`[Toast] ${newToast.title}: ${newToast.description || ''}`)
        }
        
        setToasts(prev => [...prev, newToast])
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.slice(1))
        }, 5000)
    }, [])

    return {
        toast,
        toasts,
    }
}