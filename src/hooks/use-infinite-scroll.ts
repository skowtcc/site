import { useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
    hasNextPage: boolean
    loadMore: () => Promise<void> | void
    threshold?: number // Distance from bottom to trigger load (in pixels)
    isLoading?: boolean
}

export function useInfiniteScroll({
    hasNextPage,
    loadMore,
    threshold = 200,
    isLoading = false,
}: UseInfiniteScrollOptions) {
    const isLoadingRef = useRef(isLoading)
    const loadMoreRef = useRef(loadMore)

    // Update refs when props change
    useEffect(() => {
        isLoadingRef.current = isLoading
    }, [isLoading])

    useEffect(() => {
        loadMoreRef.current = loadMore
    }, [loadMore])

    const handleScroll = useCallback(() => {
        // Don't trigger if already loading or no more pages
        if (isLoadingRef.current || !hasNextPage) {
            return
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        // Check if we're near the bottom
        if (scrollTop + windowHeight >= documentHeight - threshold) {
            loadMoreRef.current()
        }
    }, [hasNextPage, threshold])

    useEffect(() => {
        // Add throttling to prevent excessive calls
        let timeoutId: NodeJS.Timeout | null = null

        const throttledHandleScroll = () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(handleScroll, 100)
        }

        window.addEventListener('scroll', throttledHandleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll)
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [handleScroll])
}
