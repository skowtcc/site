'use client'

import React, { ReactNode } from 'react'
import { authClient } from '~/lib/auth/auth-client'

interface ProtectedRouteProps {
    children: ReactNode
    fallback?: ReactNode
    requireEmailVerified?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback = <div>Please log in to access this content.</div>,
    requireEmailVerified = false,
}) => {
    const { data: session, isPending } = authClient.useSession()
    const isAuthenticated = !!session?.user
    const user = session?.user
    const isInitialized = !isPending

    // Show loading state while auth is initializing
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center p-8">
                <div>Loading...</div>
            </div>
        )
    }

    // Check authentication
    if (!isAuthenticated) {
        return <>{fallback}</>
    }

    // Check email verification if required
    if (requireEmailVerified && !user?.emailVerified) {
        return (
            <div className="flex items-center justify-center p-8">
                <div>Please verify your email to access this content.</div>
            </div>
        )
    }

    return <>{children}</>
}

// HOC version for wrapping entire pages
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options?: {
        fallback?: ReactNode
        requireEmailVerified?: boolean
    },
) {
    const AuthenticatedComponent = (props: P) => {
        return (
            <ProtectedRoute fallback={options?.fallback} requireEmailVerified={options?.requireEmailVerified}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }

    AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
    return AuthenticatedComponent
}

// Component for content that should only show to unauthenticated users
interface GuestOnlyProps {
    children: ReactNode
    fallback?: ReactNode
}

export const GuestOnly: React.FC<GuestOnlyProps> = ({ children, fallback = <div>You are already logged in.</div> }) => {
    const { data: sessionData, isPending } = authClient.useSession()
    const isAuthenticated = !!sessionData?.user
    const isInitialized = !isPending

    // Show loading state while auth is initializing
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center p-8">
                <div>Loading...</div>
            </div>
        )
    }

    if (isAuthenticated) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
