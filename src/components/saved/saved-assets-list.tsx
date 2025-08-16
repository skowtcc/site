'use client'

import { useEffect, useState, useCallback } from 'react'
import { AssetItem } from '../asset/asset-item'
import { authClient } from '~/lib/auth/auth-client'
import { client } from '~/lib/api/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import { Search, Loader2, Grid, List } from 'lucide-react'
import Image from 'next/image'
import { useDebounce } from '~/hooks/use-debounce'

interface SavedAssetsFilters {
    searchQuery: string
    selectedGames: string[]
    selectedCategories: string[]
    selectedTags: string[]
    sortBy: 'savedAt' | 'viewCount' | 'downloadCount' | 'uploadDate' | 'name'
    sortOrder: 'asc' | 'desc'
}

interface MultiSelectAccordionProps {
    title: string
    options: Array<{
        id: string
        name: string
        slug?: string
    }>
    selected: string[]
    onSelectionChange: (selected: string[]) => void
}

function MultiSelectAccordion({ title, options, selected, onSelectionChange }: MultiSelectAccordionProps) {
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
                    <div className="space-y-2 max-h-64 overflow-y-auto">
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export function SavedAssetsList() {
    const [savedAssets, setSavedAssets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)
    
    // Filter options from saved assets
    const [availableGames, setAvailableGames] = useState<any[]>([])
    const [availableCategories, setAvailableCategories] = useState<any[]>([])
    const [availableTags, setAvailableTags] = useState<any[]>([])
    
    const [filters, setFilters] = useState<SavedAssetsFilters>({
        searchQuery: '',
        selectedGames: [],
        selectedCategories: [],
        selectedTags: [],
        sortBy: 'savedAt',
        sortOrder: 'desc',
    })

    const debouncedSearch = useDebounce(filters.searchQuery, 300)
    
    const { data: session } = authClient.useSession()
    const user = session?.user

    const updateFilter = <K extends keyof SavedAssetsFilters>(key: K, value: SavedAssetsFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1) // Reset to first page when filters change
    }

    const fetchSavedAssets = useCallback(async () => {
        if (!user) return
        
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', page.toString())
            params.append('limit', '20')
            
            if (debouncedSearch) params.append('search', debouncedSearch)
            
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

            const response = await client.get(`/user/saved-assets`, {
                query: Object.fromEntries(params)
            })
            
            setSavedAssets(response.savedAssets || [])
            setPagination(response.pagination)
            
            // Extract unique games, categories, and tags from all saved assets
            // This would ideally come from a separate endpoint, but we'll work with what we have
            const games = new Map()
            const categories = new Map()
            const tags = new Map()
            
            if (response.savedAssets && response.savedAssets.length > 0) {
                response.savedAssets.forEach((asset: any) => {
                if (!games.has(asset.gameId)) {
                    games.set(asset.gameId, {
                        id: asset.gameId,
                        name: asset.gameName,
                        slug: asset.gameSlug
                    })
                }
                if (!categories.has(asset.categoryId)) {
                    categories.set(asset.categoryId, {
                        id: asset.categoryId,
                        name: asset.categoryName,
                        slug: asset.categorySlug
                    })
                }
                    asset.tags.forEach((tag: any) => {
                        if (!tags.has(tag.id)) {
                            tags.set(tag.id, {
                                id: tag.id,
                                name: tag.name,
                                slug: tag.slug
                            })
                        }
                    })
                })
                
                // Only update if we're on the first page (to get all options)
                if (page === 1 && filters.selectedGames.length === 0 && filters.selectedCategories.length === 0 && filters.selectedTags.length === 0) {
                    setAvailableGames(Array.from(games.values()))
                    setAvailableCategories(Array.from(categories.values()))
                    setAvailableTags(Array.from(tags.values()))
                }
            }
        } catch (error) {
            console.error('Failed to fetch saved assets:', error)
        } finally {
            setLoading(false)
        }
    }, [user, page, debouncedSearch, filters.selectedGames, filters.selectedCategories, filters.selectedTags, filters.sortBy, filters.sortOrder])

    useEffect(() => {
        fetchSavedAssets()
    }, [fetchSavedAssets])

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
                    <p className="text-muted-foreground">You must be logged in to view your saved assets.</p>
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
                            placeholder="Search saved assets..."
                            className="pl-10"
                            value={filters.searchQuery}
                            onChange={e => updateFilter('searchQuery', e.target.value)}
                        />
                    </div>

                    {availableGames.length > 0 && (
                        <MultiSelectAccordion
                            title="Games"
                            options={availableGames}
                            selected={filters.selectedGames}
                            onSelectionChange={selected => updateFilter('selectedGames', selected)}
                        />
                    )}

                    {availableCategories.length > 0 && (
                        <MultiSelectAccordion
                            title="Categories"
                            options={availableCategories}
                            selected={filters.selectedCategories}
                            onSelectionChange={selected => updateFilter('selectedCategories', selected)}
                        />
                    )}

                    {availableTags.length > 0 && (
                        <MultiSelectAccordion
                            title="Tags"
                            options={availableTags}
                            selected={filters.selectedTags}
                            onSelectionChange={selected => updateFilter('selectedTags', selected)}
                        />
                    )}

                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="savedAt">Date Saved</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="downloadCount">Downloads</SelectItem>
                                <SelectItem value="viewCount">Views</SelectItem>
                                <SelectItem value="uploadDate">Upload Date</SelectItem>
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
                        {pagination && (
                            <span>Showing {savedAssets.length} of {pagination.total} saved assets</span>
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
                ) : savedAssets.length === 0 ? (
                    <div className="text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
                        <div>
                            <p className="text-lg font-medium mb-2">No saved assets found</p>
                            <p className="text-sm">Try adjusting your filters or save some assets first.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
                            {savedAssets.map(asset => (
                                <AssetItem key={asset.id} asset={asset} variant={viewMode === 'grid' ? 'card' : 'list'} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page - 1)}
                                    disabled={!pagination.hasPrev}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}