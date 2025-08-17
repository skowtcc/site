'use client'

import { useEffect, useState, useCallback } from 'react'
import { AssetItem } from './asset-item'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Search, Loader2, Grid, List } from 'lucide-react'
import Image from 'next/image'
import { client } from '~/lib/api/client'
import { authClient } from '~/lib/auth/auth-client'
import { useSearchParams } from 'next/navigation'

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
    onSelectionChange 
}: {
    title: string
    options: FilterOption[]
    selected: string[]
    onSelectionChange: (selected: string[]) => void
}) {
    const handleToggle = (optionId: string) => {
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
                    <ScrollArea className={title === 'Tags' ? 'h-12' : 'h-64'}>
                        <div className="space-y-2 pr-4">
                            {options.map(option => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${title.toLowerCase()}-${option.id}`}
                                        checked={selected.includes(option.id)}
                                        onCheckedChange={() => handleToggle(option.id)}
                                    />
                                    {title === 'Games' && option.slug && (
                                        <Image
                                            src={`https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/${option.slug}-icon.png`}
                                            className="rounded-md"
                                            alt={option.name}
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                    <label
                                        htmlFor={`${title.toLowerCase()}-${option.id}`}
                                        className="text-sm flex-1 cursor-pointer"
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
    requireAuth = false
}: UnifiedAssetListProps) {
    // State
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [total, setTotal] = useState(0)
    const [initializedFromParams, setInitializedFromParams] = useState(false)
    
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

    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1) // Reset to first page when filters change
        setAssets([]) // Clear assets when filters change
        setHasMore(true)
    }

    const initializeFiltersFromSearchParams = useCallback((games: FilterOption[], categories: FilterOption[], tags: FilterOption[]) => {
        const initialFilters: Partial<Filters> = {}
        
        // Parse search query (supports both 'search' and 'name' params)
        const searchQuery = searchParams?.get('search') || searchParams?.get('name') || ''
        if (searchQuery) {
            initialFilters.searchQuery = searchQuery
        }
        
        // Parse games - convert slugs to IDs
        const gamesSlugs = searchParams?.get('games')?.toLowerCase().split(',') || []
        if (gamesSlugs.length > 0 && gamesSlugs[0] !== '') {
            const gameIds = gamesSlugs
                .map(slug => games.find(g => g.slug === slug.trim())?.id)
                .filter(Boolean) as string[]
            if (gameIds.length > 0) {
                initialFilters.selectedGames = gameIds
            }
        }
        
        // Parse categories - convert slugs to IDs
        const categorySlugs = searchParams?.get('categories')?.toLowerCase().split(',') || []
        if (categorySlugs.length > 0 && categorySlugs[0] !== '') {
            const categoryIds = categorySlugs
                .map(slug => categories.find(c => c.slug === slug.trim())?.id)
                .filter(Boolean) as string[]
            if (categoryIds.length > 0) {
                initialFilters.selectedCategories = categoryIds
            }
        }
        
        // Parse tags - convert slugs to IDs
        const tagSlugs = searchParams?.get('tags')?.toLowerCase().split(',') || []
        if (tagSlugs.length > 0 && tagSlugs[0] !== '') {
            const tagIds = tagSlugs
                .map(slug => tags.find(t => t.slug === slug.trim())?.id)
                .filter(Boolean) as string[]
            if (tagIds.length > 0) {
                initialFilters.selectedTags = tagIds
            }
        }
        
        // Parse sort options
        const sortBy = searchParams?.get('sortBy')
        if (sortBy && ['uploadDate', 'name', 'downloadCount', 'viewCount', 'savedAt'].includes(sortBy)) {
            initialFilters.sortBy = sortBy
        }
        
        const sortOrder = searchParams?.get('sortOrder')
        if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
            initialFilters.sortOrder = sortOrder as 'asc' | 'desc'
        }
        
        // Apply the initial filters if any were found
        if (Object.keys(initialFilters).length > 0) {
            setFilters(prev => ({ ...prev, ...initialFilters }))
        }
    }, [searchParams])

    // Fetch metadata (games, categories, tags) on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [gamesRes, categoriesRes, tagsRes] = await Promise.all([
                    client.get('/game/all'),
                    client.get('/category/all'),
                    client.get('/tag/all')
                ])
                
                const games = gamesRes.games.map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    slug: g.slug
                }))
                const categories = categoriesRes.categories.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug
                }))
                const tags = tagsRes.tags.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    slug: t.slug
                }))
                
                setAvailableGames(games)
                setAvailableCategories(categories)
                setAvailableTags(tags)
                
                // Initialize filters from URL search params only once
                if (!initializedFromParams) {
                    initializeFiltersFromSearchParams(games, categories, tags)
                    setInitializedFromParams(true)
                }
            } catch (error) {
                console.error('Failed to fetch metadata:', error)
            }
        }
        fetchMetadata()
    }, [])

    const fetchAssets = useCallback(async (isLoadMore = false) => {
        if (!hasMore && isLoadMore) return
        
        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
            setPage(1) // Reset page when not loading more
        }
        
        try {
            const params = new URLSearchParams()
            const currentPage = isLoadMore ? page : 1
            params.append('page', currentPage.toString())
            params.append('limit', '20')
            
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

            const response = await client.get(endpoint, {
                query: Object.fromEntries(params)
            }) as any
            
            const assetKey = endpoint === '/asset/search' ? 'assets' : 'savedAssets'
            const newAssets = response[assetKey] || []
            
            if (isLoadMore) {
                // Filter out duplicates when appending
                setAssets(prev => {
                    const existingIds = new Set(prev.map(a => a.id))
                    const uniqueNewAssets = newAssets.filter((asset: Asset) => !existingIds.has(asset.id))
                    return [...prev, ...uniqueNewAssets]
                })
                setPage(prev => prev + 1)
            } else {
                setAssets(newAssets)
            }
            
            setHasMore(response.pagination?.hasNext || false)
            setTotal(response.pagination?.total || 0)
        } catch (error) {
            console.error('Failed to fetch assets:', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [page, filters, endpoint, availableGames, availableCategories, availableTags, hasMore])

    useEffect(() => {
        if (availableGames.length > 0 || availableCategories.length > 0 || availableTags.length > 0) {
            fetchAssets(false)
        }
    }, [filters.searchQuery, filters.selectedGames, filters.selectedCategories, filters.selectedTags, filters.sortBy, filters.sortOrder, availableGames, availableCategories, availableTags])

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore || loading) return
            
            const scrollPosition = window.innerHeight + window.scrollY
            const documentHeight = document.documentElement.offsetHeight
            
            // Load more when user is 200px from the bottom
            if (scrollPosition >= documentHeight - 200) {
                fetchAssets(true)
            }
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [loadingMore, hasMore, loading, fetchAssets])


    // Adjust sort options for saved assets
    const adjustedSortOptions = endpoint === '/user/saved-assets' 
        ? [{ value: 'savedAt', label: 'Date Saved' }, ...sortOptions]
        : sortOptions

    // Show auth required message if needed (after all hooks)
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
            {/* Filters Sidebar */}
            <div className="2xl:w-80 w-full bg-card rounded-lg border p-4 pt-2 space-y-6 h-fit">
                <div className="space-y-4">
                    <div className="relative py-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            className="pl-10"
                            value={filters.searchQuery}
                            onChange={e => updateFilter('searchQuery', e.target.value)}
                        />
                    </div>

                    <MultiSelectFilter
                        title="Games"
                        options={availableGames}
                        selected={filters.selectedGames}
                        onSelectionChange={selected => updateFilter('selectedGames', selected)}
                    />

                    <MultiSelectFilter
                        title="Categories"
                        options={availableCategories}
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
                            <SelectTrigger className="w-full">
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
                            <SelectTrigger className="w-full">
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

            {/* Assets List */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                        {total > 0 && (
                            <span>Showing {assets.length} of {total} assets</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? 'bg-muted' : ''}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'bg-muted' : ''}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
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
                        <div className={viewMode === 'grid' 
                            ? 'columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-4 space-y-4' 
                            : 'flex flex-col gap-4'
                        }>
                            {assets.map(asset => (
                                <AssetItem key={asset.id} asset={asset} variant={viewMode === 'grid' ? 'card' : 'list'} />
                            ))}
                        </div>

                        {/* Loading indicator for infinite scroll */}
                        {loadingMore && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2 text-sm text-muted-foreground">Loading more assets...</span>
                            </div>
                        )}
                        
                        {/* End of results message */}
                        {!hasMore && assets.length > 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                No more assets to load
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
