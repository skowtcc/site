'use client'

import { Search } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useAssetContext } from './asset-context'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import Image from 'next/image'

interface MultiSelectAccordionProps {
    title: string
    options: Array<{
        id: string
        name: string
        slug?: string
        disabled?: boolean
    }>
    selected: string[]
    onSelectionChange: (selected: string[]) => void
}

function MultiSelectAccordion({ title, options, selected, onSelectionChange }: MultiSelectAccordionProps) {
    const handleToggle = (optionId: string) => {
        const option = options.find(opt => opt.id === optionId)
        if (option?.disabled) return // Don't allow toggling disabled options

        const newSelected = selected.includes(optionId)
            ? selected.filter(id => id !== optionId)
            : [...selected, optionId]
        onSelectionChange(newSelected)
    }

    // Sort options: enabled first, then disabled at the bottom
    const sortedOptions = [...options].sort((a, b) => {
        if (a.disabled && !b.disabled) return 1
        if (!a.disabled && b.disabled) return -1
        return a.name.localeCompare(b.name)
    })

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={title.toLowerCase()} className="border-0">
                <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                    {title} {selected.length > 0 && `(${selected.length})`}
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    <div className="space-y-2 overflow-y-auto">
                        {sortedOptions.map(option => (
                            <div
                                key={option.id}
                                className={`flex items-center space-x-2 ${option.disabled ? 'opacity-50' : ''}`}
                            >
                                <Checkbox
                                    id={`${title.toLowerCase()}-${option.id}`}
                                    checked={selected.includes(option.id)}
                                    disabled={option.disabled}
                                    onCheckedChange={() => handleToggle(option.id)}
                                />
                                {title === 'Games' && (
                                    <Image
                                        src={`https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/${option.slug}-icon.png`}
                                        className={`rounded-md ${option.disabled ? 'grayscale' : ''}`}
                                        alt={option.name}
                                        width={20}
                                        height={20}
                                    />
                                )}
                                <label
                                    htmlFor={`${title.toLowerCase()}-${option.id}`}
                                    className={`text-sm flex-1 ${
                                        option.disabled ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'
                                    }`}
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

const sortOptions = [
    { value: 'downloadCount', label: 'Download Count' },
    { value: 'viewCount', label: 'View Count' },
    { value: 'name', label: 'Name' },
    { value: 'uploadDate', label: 'Upload Date' },
]

export function AssetFilters() {
    const { filters, updateFilter, games, categories, allTags, loading } = useAssetContext()

    // Function to get all categories with availability status based on selected games
    const getCategoriesWithAvailability = () => {
        if (filters.selectedGames.length === 0) {
            return categories.map(category => ({ ...category, disabled: false }))
        }

        // Get categories that exist in the selected games
        const availableCategoryIds = new Set<string>()

        games
            .filter(game => filters.selectedGames.includes(game.id))
            .forEach(game => {
                game.categories.forEach(category => {
                    availableCategoryIds.add(category.id)
                })
            })

        return categories.map(category => ({
            ...category,
            disabled: !availableCategoryIds.has(category.id),
        }))
    }

    // Function to get all games with availability status based on selected categories
    const getGamesWithAvailability = () => {
        if (filters.selectedCategories.length === 0) {
            return games.map(game => ({ ...game, disabled: false }))
        }

        // Get games that have at least one of the selected categories
        return games.map(game => ({
            ...game,
            disabled: !game.categories.some(category => filters.selectedCategories.includes(category.id)),
        }))
    }

    if (loading && !games.length && !categories.length) {
        return (
            <div className="2xl:w-80 w-full bg-card rounded-lg border-secondary border p-4 pt-2 space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-20 bg-muted rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="2xl:w-80 w-full bg-card rounded-lg border-secondary border p-4 pt-2 space-y-6">
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

                <MultiSelectAccordion
                    title="Games"
                    options={getGamesWithAvailability()}
                    selected={filters.selectedGames}
                    onSelectionChange={selected => updateFilter('selectedGames', selected)}
                />

                <MultiSelectAccordion
                    title="Categories"
                    options={getCategoriesWithAvailability()}
                    selected={filters.selectedCategories}
                    onSelectionChange={selected => updateFilter('selectedCategories', selected)}
                />

                <MultiSelectAccordion
                    title="Tags"
                    options={allTags.map(tag => ({ ...tag, disabled: false }))}
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
                            {sortOptions.map(option => (
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
    )
}
