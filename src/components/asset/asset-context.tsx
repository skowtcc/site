'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { client } from '~/lib/api/client'
import { z } from 'zod'
import { type Endpoints } from '~/lib/api/schema/api.zod'

export interface FilterState {
    searchQuery: string
    selectedGames: string[]
    selectedCategories: string[]
    selectedTags: string[]
    sortBy: 'downloadCount' | 'uploadDate' | 'viewCount' | 'name'
    sortOrder: 'asc' | 'desc'
    page: number
    limit: number
}

export type ViewMode = 'grid' | 'list'

type Asset = Endpoints.get__asset_search['response']['assets'][0]
type Game = Endpoints.get__game_all['response']['games'][0]
type Category = Endpoints.get__category_all['response']['categories'][0]

interface AssetContextType {
    filters: FilterState
    setFilters: (filters: FilterState) => void
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
    clearFilters: () => void
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    assets: Asset[]
    games: Game[]
    categories: Category[]
    allTags: Array<{
        id: string
        name: string
        slug: string
        color: string | null
    }>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    } | null
    loading: boolean
    loadingMore: boolean
    error: string | null
    loadMore: () => Promise<void>
}

type Tag = Endpoints.get__tag_all['response']['tags'][0]

const AssetContext = createContext<AssetContextType | undefined>(undefined)

export function AssetProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: '',
        selectedGames: [],
        selectedCategories: [],
        selectedTags: [],
        sortBy: 'downloadCount',
        sortOrder: 'desc',
        page: 1,
        limit: 50,
    })

    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [assets, setAssets] = useState<Asset[]>([])
    const [games, setGames] = useState<Game[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [allTags, setAllTags] = useState<Tag[]>([])
    const [pagination, setPagination] = useState<AssetContextType['pagination']>(null)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastFiltersRef = useRef<FilterState>(filters)
    const initialLoadRef = useRef<boolean>(true)

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : (value as number),
        }))
    }

    const clearFilters = () => {
        setFilters({
            searchQuery: '',
            selectedGames: [],
            selectedCategories: [],
            selectedTags: [],
            sortBy: 'downloadCount',
            sortOrder: 'desc',
            page: 1,
            limit: 50,
        })
    }

    const fetchStaticData = async () => {
        try {
            const [gamesResponse, categoriesResponse, tagsResponse] = await Promise.all([
                client.get('/game/all'),
                client.get('/category/all'),
                client.get('/tag/all'),
            ])

            setGames(gamesResponse.games)
            setCategories(categoriesResponse.categories)
            setAllTags(tagsResponse.tags)
        } catch (err) {
            console.error('Failed to fetch static data:', err)
            setError('Failed to load games, categories, and tags')
        }
    }

    const fetchAssets = useCallback(
        async (currentFilters: FilterState, append: boolean = false) => {
            if (append) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }
            setError(null)

            try {
                const queryParams: Record<string, string> = {
                    page: currentFilters.page.toString(),
                    limit: currentFilters.limit.toString(),
                    sortBy: currentFilters.sortBy,
                    sortOrder: currentFilters.sortOrder,
                }

                if (currentFilters.searchQuery) {
                    queryParams.name = currentFilters.searchQuery
                }
                if (currentFilters.selectedTags.length > 0) {
                    const tagSlugs = currentFilters.selectedTags
                        .map(tagId => allTags.find(tag => tag.id === tagId)?.slug)
                        .filter(Boolean)
                    if (tagSlugs.length > 0) {
                        queryParams.tags = tagSlugs.join(',')
                    }
                }
                if (currentFilters.selectedGames.length > 0) {
                    const gameSlugs = currentFilters.selectedGames
                        .map(gameId => games.find(game => game.id === gameId)?.slug)
                        .filter(Boolean)
                    if (gameSlugs.length > 0) {
                        queryParams.games = gameSlugs.join(',')
                    }
                }
                if (currentFilters.selectedCategories.length > 0) {
                    const categorySlugs = currentFilters.selectedCategories
                        .map(categoryId => categories.find(category => category.id === categoryId)?.slug)
                        .filter(Boolean)
                    if (categorySlugs.length > 0) {
                        queryParams.categories = categorySlugs.join(',')
                    }
                }

                const response = await client.get('/asset/search', {
                    query: queryParams,
                })

                if (append) {
                    setAssets(prev => [...prev, ...response.assets])
                } else {
                    setAssets(response.assets)
                }
                setPagination(response.pagination)
            } catch (err) {
                console.error('Failed to fetch assets:', err)
                setError('Failed to load assets')
                if (!append) {
                    setAssets([])
                    setPagination(null)
                }
            } finally {
                if (append) {
                    setLoadingMore(false)
                } else {
                    setLoading(false)
                }
            }
        },
        [games, categories, allTags],
    )

    const loadMore = useCallback(async () => {
        if (!pagination?.hasNext || loadingMore) return

        const nextPageFilters = {
            ...filters,
            page: pagination.page + 1,
        }

        await fetchAssets(nextPageFilters, true)
    }, [filters, pagination, loadingMore, fetchAssets])

    useEffect(() => {
        fetchStaticData()
    }, [])

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        const arraysEqual = (a: string[], b: string[]) => {
            if (a.length !== b.length) return false
            return a.every((val, i) => val === b[i])
        }

        const lastFilters = lastFiltersRef.current

        const searchQueryChanged = filters.searchQuery !== lastFilters.searchQuery

        const instantFiltersChanged =
            !arraysEqual(filters.selectedGames, lastFilters.selectedGames) ||
            !arraysEqual(filters.selectedCategories, lastFilters.selectedCategories) ||
            !arraysEqual(filters.selectedTags, lastFilters.selectedTags) ||
            filters.sortBy !== lastFilters.sortBy ||
            filters.sortOrder !== lastFilters.sortOrder ||
            filters.page !== lastFilters.page ||
            filters.limit !== lastFilters.limit

        if (initialLoadRef.current) {
            initialLoadRef.current = false
            fetchAssets(filters)
            lastFiltersRef.current = filters
            return
        }

        if (instantFiltersChanged) {
            fetchAssets(filters)
            lastFiltersRef.current = filters
            return
        }

        if (searchQueryChanged) {
            searchTimeoutRef.current = setTimeout(() => {
                fetchAssets(filters)
                lastFiltersRef.current = filters
            }, 2000)
            return
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [filters, fetchAssets])

    return (
        <AssetContext.Provider
            value={{
                filters,
                setFilters,
                updateFilter,
                clearFilters,
                viewMode,
                setViewMode,
                assets,
                games,
                categories,
                allTags,
                pagination,
                loading,
                loadingMore,
                error,
                loadMore,
            }}
        >
            {children}
        </AssetContext.Provider>
    )
}

export function useAssetContext() {
    const context = useContext(AssetContext)
    if (context === undefined) {
        throw new Error('useAssetContext must be used within an AssetProvider')
    }
    return context
}
