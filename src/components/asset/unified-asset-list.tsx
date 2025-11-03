'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { AssetItem } from './asset-item'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import { ScrollArea } from '~/components/ui/scroll-area'
import { HiSearch, HiOutlineViewGrid, HiMenu } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Image from 'next/image'
import { client } from '~/lib/api/client'
import { authClient } from '~/lib/auth/auth-client'
import { useSearchParams } from 'next/navigation'
// @ts-expect-error no types available afaik?
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

// Types
interface Asset {
    id: string
    name: string
    gameId: string
    gameName: string
    gameSlug: string
    categoryId: string
    categoryName: string
    categorySlug: string
    downloadCount: number
    viewCount: number
    size: number
    extension: string
    createdAt: string
    isSuggestive: boolean
    tags: Array<{
        id: string
        name: string
        slug: string
        color: string | null
    }>
    uploadedBy: {
        id: string
        username: string | null
        image: string | null
    }
}

interface Filters {
    searchQuery: string
    selectedGames: string[]
    selectedCategories: string[]
    selectedTags: string[]
    sortBy: string
    sortOrder: 'asc' | 'desc'
}

interface FilterOption {
    id: string
    name: string
    slug?: string
    categories?: Array<{ id: string; slug: string; name: string }>
    disabled?: boolean
}

interface UnifiedAssetListProps {
    endpoint: '/asset/search' | '/user/saved-assets'
    title?: string
    description?: string
    sortOptions?: Array<{ value: string; label: string }>
    defaultSortBy?: string
    requireAuth?: boolean
}

// Reusable filter component
function MultiSelectFilter({
    title,
    options,
    selected,
    onSelectionChange,
}: {
    title: string
    options: FilterOption[]
    selected: string[]
    onSelectionChange: (selected: string[]) => void
}) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options
        return options.filter(option => option.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [options, searchQuery])
    const handleToggle = (optionId: string, disabled?: boolean) => {
        if (disabled) return // Don't allow toggling disabled options
        const newSelected = selected.includes(optionId)
            ? selected.filter(id => id !== optionId)
            : [...selected, optionId]
        onSelectionChange(newSelected)
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={title.toLowerCase()} className="border-0">
                <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                    {title} {selected.length > 0 && `(${selected.length})`}
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    <div className="mb-3">
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={`Search ${title.toLowerCase()}...`}
                                className="pl-9 h-8 text-sm bg-secondary/20"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <ScrollArea className={title === 'Tags' ? 'h-12' : 'h-64'}>
                        <div className="space-y-2 pr-4">
                            {filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`flex items-center space-x-2 ${option.disabled ? 'opacity-50' : ''}`}
                                >
                                    <Checkbox
                                        id={`${title.toLowerCase()}-${option.id}`}
                                        checked={selected.includes(option.id)}
                                        disabled={option.disabled}
                                        onCheckedChange={() => handleToggle(option.id, option.disabled)}
                                    />
                                    {title === 'Games' && option.slug && (
                                        <Image
                                            src={`https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/${option.slug}-icon.png`}
                                            className={`rounded-sm ${option.disabled ? 'grayscale' : ''}`}
                                            alt={option.name}
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                    <label
                                        htmlFor={`${title.toLowerCase()}-${option.id}`}
                                        className={`text-sm flex-1 ${option.disabled ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                                    >
                                        {option.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export function UnifiedAssetList({
    endpoint,
    title,
    description,
    sortOptions = [
        { value: 'uploadDate', label: 'Upload Date' },
        { value: 'name', label: 'Name' },
        { value: 'downloadCount', label: 'Downloads' },
        { value: 'viewCount', label: 'Views' },
    ],
    defaultSortBy = 'uploadDate',
    requireAuth = false,
}: UnifiedAssetListProps) {
    // State
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(endpoint === '/user/saved-assets' ? 'list' : 'grid')
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [initializedFromParams, setInitializedFromParams] = useState(false)
    const [initialFetched, setInitialFetched] = useState(false)

    // Filter options
    const [availableGames, setAvailableGames] = useState<FilterOption[]>([])
    const [availableCategories, setAvailableCategories] = useState<FilterOption[]>([])
    const [availableTags, setAvailableTags] = useState<FilterOption[]>([])

    const [filters, setFilters] = useState<Filters>({
        searchQuery: '',
        selectedGames: [],
        selectedCategories: [],
        selectedTags: [],
        sortBy: endpoint === '/user/saved-assets' ? 'savedAt' : defaultSortBy,
        sortOrder: 'desc',
    })

    const searchParams = useSearchParams()

    // Auth check for saved assets
    const { data: session } = authClient.useSession()
    const user = session?.user

    // Computed options with disabled states based on current selection
    const gamesWithDisabledState = useMemo(() => {
        const gamesWithStates = availableGames.map(game => ({
            ...game,
            disabled:
                filters.selectedCategories.length > 0 &&
                (() => {
                    const gameData = availableGames.find(g => g.id === game.id) as any
                    if (gameData?.categories) {
                        return !filters.selectedCategories.some(catId =>
                            gameData.categories.some((cat: any) => cat.id === catId),
                        )
                    }
                    return true
                })(),
        }))

        // Sort: available options first, then disabled ones
        return gamesWithStates.sort((a, b) => {
            if (a.disabled && !b.disabled) return 1
            if (!a.disabled && b.disabled) return -1
            return a.name.localeCompare(b.name) // Alphabetical within each group
        })
    }, [availableGames, filters.selectedCategories])

    const categoriesWithDisabledState = useMemo(() => {
        const categoriesWithStates = availableCategories.map(category => ({
            ...category,
            disabled:
                filters.selectedGames.length > 0 &&
                (() => {
                    return !filters.selectedGames.some(gameId => {
                        const gameData = availableGames.find(g => g.id === gameId) as any
                        if (gameData?.categories) {
                            return gameData.categories.some((cat: any) => cat.id === category.id)
                        }
                        return false
                    })
                })(),
        }))

        // Sort: available options first, then disabled ones
        return categoriesWithStates.sort((a, b) => {
            if (a.disabled && !b.disabled) return 1
            if (!a.disabled && b.disabled) return -1
            return a.name.localeCompare(b.name) // Alphabetical within each group
        })
    }, [availableCategories, availableGames, filters.selectedGames])

    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setOffset(0)
        setAssets([])
        setHasMore(true)
    }

    const parseInitialSearchParams = useCallback(
        (games: FilterOption[], categories: FilterOption[], tags: FilterOption[]) => {
            const initialFilters: Partial<Filters> = {}

            const searchQuery = searchParams?.get('search') || searchParams?.get('name') || ''
            if (searchQuery) {
                initialFilters.searchQuery = searchQuery
            }

            const gamesSlugs = searchParams?.get('games')?.toLowerCase().split(',') || []
            if (gamesSlugs.length > 0 && gamesSlugs[0] !== '') {
                const gameIds = gamesSlugs
                    .map(slug => games.find(g => g.slug === slug.trim())?.id)
                    .filter(Boolean) as string[]
                if (gameIds.length > 0) {
                    initialFilters.selectedGames = gameIds
                }
            }

            const categorySlugs = searchParams?.get('categories')?.toLowerCase().split(',') || []
            if (categorySlugs.length > 0 && categorySlugs[0] !== '') {
                const categoryIds = categorySlugs
                    .map(slug => categories.find(c => c.slug === slug.trim())?.id)
                    .filter(Boolean) as string[]
                if (categoryIds.length > 0) {
                    initialFilters.selectedCategories = categoryIds
                }
            }

            const tagSlugs = searchParams?.get('tags')?.toLowerCase().split(',') || []
            if (tagSlugs.length > 0 && tagSlugs[0] !== '') {
                const tagIds = tagSlugs
                    .map(slug => tags.find(t => t.slug === slug.trim())?.id)
                    .filter(Boolean) as string[]
                if (tagIds.length > 0) {
                    initialFilters.selectedTags = tagIds
                }
            }

            const sortBy = searchParams?.get('sortBy')
            if (sortBy && ['uploadDate', 'name', 'downloadCount', 'viewCount', 'savedAt'].includes(sortBy)) {
                initialFilters.sortBy = sortBy
            }

            const sortOrder = searchParams?.get('sortOrder')
            if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
                initialFilters.sortOrder = sortOrder as 'asc' | 'desc'
            }

            return initialFilters
        },
        [],
    )

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [gamesRes, categoriesRes, tagsRes] = await Promise.all([
                    client.get('/game/all'),
                    client.get('/category/all'),
                    client.get('/tag/all'),
                ])

                const games = gamesRes.games.map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    slug: g.slug,
                    categories: g.categories || [],
                }))
                const categories = categoriesRes.categories.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                }))
                const tags = tagsRes.tags.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    slug: t.slug,
                }))

                setAvailableGames(games)
                setAvailableCategories(categories)
                setAvailableTags(tags)

                if (!initializedFromParams) {
                    const urlFilters = parseInitialSearchParams(games, categories, tags)
                    if (Object.keys(urlFilters).length > 0) {
                        setFilters(prev => ({ ...prev, ...urlFilters }))
                    }
                    setInitializedFromParams(true)
                }
            } catch (error) {
                console.error('Failed to fetch metadata:', error)
            }
        }
        fetchMetadata()
    }, [])

    const fetchAssets = useCallback(
        async (isLoadMore = false) => {
            if (!hasMore && isLoadMore) return

            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            try {
                const params = new URLSearchParams()
                const currentOffset = isLoadMore ? offset : 0
                params.append('offset', currentOffset.toString())

                if (filters.searchQuery.trim()) {
                    params.append(endpoint === '/asset/search' ? 'name' : 'search', filters.searchQuery.trim())
                }

                // Convert IDs to slugs for API
                if (filters.selectedGames.length > 0) {
                    const gameSlugs = filters.selectedGames
                        .map(gameId => availableGames.find(game => game.id === gameId)?.slug)
                        .filter(Boolean)
                    if (gameSlugs.length > 0) {
                        params.append('games', gameSlugs.join(','))
                    }
                }

                if (filters.selectedCategories.length > 0) {
                    const categorySlugs = filters.selectedCategories
                        .map(categoryId => availableCategories.find(category => category.id === categoryId)?.slug)
                        .filter(Boolean)
                    if (categorySlugs.length > 0) {
                        params.append('categories', categorySlugs.join(','))
                    }
                }

                if (filters.selectedTags.length > 0) {
                    const tagSlugs = filters.selectedTags
                        .map(tagId => availableTags.find(tag => tag.id === tagId)?.slug)
                        .filter(Boolean)
                    if (tagSlugs.length > 0) {
                        params.append('tags', tagSlugs.join(','))
                    }
                }

                params.append('sortBy', filters.sortBy)
                params.append('sortOrder', filters.sortOrder)

                const response = (await client.get(endpoint, {
                    query: Object.fromEntries(params),
                })) as any

                const assetKey = endpoint === '/asset/search' ? 'assets' : 'savedAssets'
                const newAssets = response[assetKey] || []

                if (isLoadMore) {
                    // Filter out duplicates when appending
                    setAssets(prev => {
                        const existingIds = new Set(prev.map(a => a.id))
                        const uniqueNewAssets = newAssets.filter((asset: Asset) => !existingIds.has(asset.id))
                        return [...prev, ...uniqueNewAssets]
                    })
                    setOffset(prev => prev + 20)
                } else {
                    setAssets(newAssets)
                }

                setHasMore(response.pagination?.hasNext || false)
                // Note: total count is no longer provided in the new API response
            } catch (error) {
                console.error('Failed to fetch assets:', error)
            } finally {
                setLoading(false)
                setLoadingMore(false)
                // Mark that the initial fetch has completed (or a subsequent fetch finished)
                setInitialFetched(true)
            }
        },
        [offset, filters, endpoint, availableGames, availableCategories, availableTags],
    )

    useEffect(() => {
        if (availableGames.length > 0 || availableCategories.length > 0 || availableTags.length > 0) {
            fetchAssets(false)
        }
    }, [
        filters.searchQuery,
        filters.selectedGames,
        filters.selectedCategories,
        filters.selectedTags,
        filters.sortBy,
        filters.sortOrder,
        availableGames,
        availableCategories,
        availableTags,
    ])

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore || loading) return

            const scrollPosition = window.innerHeight + window.scrollY
            const documentHeight = document.documentElement.offsetHeight

            if (scrollPosition >= documentHeight - 200) {
                fetchAssets(true)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [loadingMore, hasMore, loading, fetchAssets])

    const adjustedSortOptions =
        endpoint === '/user/saved-assets' ? [{ value: 'savedAt', label: 'Date Saved' }, ...sortOptions] : sortOptions

    if (requireAuth && !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
                    <p className="text-muted-foreground">You must be logged in to view this content.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col 2xl:flex-row gap-6">
            <div className="2xl:w-80 2xl:min-w-80 w-full bg-card rounded-lg border p-4 pt-2 space-y-6 h-fit 2xl:flex-shrink-0">
                <div className="space-y-4">
                    <div className="py-2">
                        <label className="text-sm font-medium mb-2 block">Asset Name</label>
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="e.g 'Hu Tao'..."
                                className="pl-10 bg-secondary/20"
                                value={filters.searchQuery}
                                onChange={e => updateFilter('searchQuery', e.target.value)}
                            />
                        </div>
                    </div>

                    <MultiSelectFilter
                        title="Games"
                        options={gamesWithDisabledState}
                        selected={filters.selectedGames}
                        onSelectionChange={selected => updateFilter('selectedGames', selected)}
                    />

                    <MultiSelectFilter
                        title="Categories"
                        options={categoriesWithDisabledState}
                        selected={filters.selectedCategories}
                        onSelectionChange={selected => updateFilter('selectedCategories', selected)}
                    />

                    <MultiSelectFilter
                        title="Tags"
                        options={availableTags}
                        selected={filters.selectedTags}
                        onSelectionChange={selected => updateFilter('selectedTags', selected)}
                    />

                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                            <SelectTrigger className="w-full bg-secondary/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {adjustedSortOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-medium">Sort Order</label>
                        <Select
                            value={filters.sortOrder}
                            onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}
                        >
                            <SelectTrigger className="w-full bg-secondary/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Descending</SelectItem>
                                <SelectItem value="asc">Ascending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div></div>
                    {/* ? why */}
                    {endpoint !== '/user/saved-assets' && (
                        <div className="bg-card flex flex-row gap-3 px-3 p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <HiOutlineViewGrid size={16} />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <HiMenu size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {loading || !initialFetched ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin" />
                    </div>
                ) : assets.length === 0 ? (
                    <div className="text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
                        <div>
                            <p className="text-lg font-medium mb-2">No assets found</p>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{ 350: 2, 768: 3, 1280: 3 }}
                                gutterBreakpoints={{ 350: '20px', 768: '20px', 1280: '20px' }}
                            >
                                <Masonry sequential={true}>
                                    {assets.map(asset => (
                                        <AssetItem
                                            className="w-full mb-0"
                                            key={asset.id}
                                            asset={asset}
                                            variant="card"
                                        />
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
                                {assets.map(asset => (
                                    <AssetItem key={asset.id} asset={asset} variant="list" />
                                ))}
                            </div>
                        )}
                        {loadingMore && (
                            <div className="flex items-center justify-center py-8">
                                <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
