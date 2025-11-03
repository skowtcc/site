'use client'

import { Badge } from '~/components/ui/badge'
import { EyeOffIcon } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '~/lib/redux/store'
import { toggleAssetSelection } from '~/lib/redux/slices/asset-slice'
import { isAssetSelected } from '~/lib/redux/utils'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { HiOutlineCalendar, HiOutlineDocument } from 'react-icons/hi'
import { cn } from '~/lib/utils'

const LOCAL_STORAGE_KEY = 'showSuggestiveContent'

type Asset = {
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

function DynamicTagDisplay({
    tags,
    gameSlug,
    gameName,
    tagObjects,
}: {
    tags: string[]
    gameSlug: string
    gameName: string
    tagObjects?: Array<{ id: string; name: string; color: string | null }>
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleTags, setVisibleTags] = useState<string[]>([])
    const [hiddenCount, setHiddenCount] = useState(0)
    const [truncatedCategory, setTruncatedCategory] = useState<string>('')

    useEffect(() => {
        const calculateVisibleTags = () => {
            if (!containerRef.current) return

            const container = containerRef.current
            const containerWidth = container.offsetWidth
            const gap = 4
            let currentWidth = 0
            const visible: string[] = []
            let hidden = 0

            const tempContainer = document.createElement('div')
            tempContainer.style.position = 'absolute'
            tempContainer.style.visibility = 'hidden'
            tempContainer.style.whiteSpace = 'nowrap'
            tempContainer.className = 'text-xs px-2 py-1 bg-secondary rounded-md'
            document.body.appendChild(tempContainer)

            if (tags.length > 0) {
                const category = tags[0]
                tempContainer.textContent = category
                const fullCategoryWidth = tempContainer.offsetWidth + gap

                if (fullCategoryWidth <= containerWidth) {
                    visible.push(category)
                    currentWidth += fullCategoryWidth
                    setTruncatedCategory('')
                } else {
                    let truncated = category
                    let truncatedWidth = 0

                    for (let i = category.length - 1; i >= 0; i--) {
                        const testText = category.substring(0, i) + '...'
                        tempContainer.textContent = testText
                        truncatedWidth = tempContainer.offsetWidth + gap

                        if (truncatedWidth <= containerWidth) {
                            visible.push(testText)
                            currentWidth += truncatedWidth
                            setTruncatedCategory(testText)
                            break
                        }
                    }

                    if (truncatedWidth > containerWidth) {
                        tempContainer.textContent = '...'
                        const ellipsisWidth = tempContainer.offsetWidth + gap
                        if (ellipsisWidth <= containerWidth) {
                            visible.push('...')
                            currentWidth += ellipsisWidth
                            setTruncatedCategory('...')
                        }
                    }
                }
            }

            for (let i = 1; i < tags.length; i++) {
                tempContainer.textContent = tags[i]
                const tagWidth = tempContainer.offsetWidth + gap

                if (currentWidth + tagWidth <= containerWidth) {
                    visible.push(tags[i])
                    currentWidth += tagWidth
                } else {
                    hidden++
                }
            }

            if (hidden > 0) {
                tempContainer.textContent = `+${hidden} more`
                const moreWidth = tempContainer.offsetWidth + gap

                if (currentWidth + moreWidth > containerWidth && visible.length > 1) {
                    visible.pop()
                    hidden++
                }
            }

            document.body.removeChild(tempContainer)
            setVisibleTags(visible)
            setHiddenCount(hidden)
        }

        calculateVisibleTags()

        const handleResize = () => {
            calculateVisibleTags()
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [tags])

    return (
        <div ref={containerRef} className="flex flex-wrap gap-1 h-6 overflow-hidden">
            <Badge variant="secondary" className="text-xs">
                <Image
                    src={
                        'https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/' +
                        gameSlug +
                        '-icon.png'
                    }
                    className="rounded-sm"
                    alt={gameName}
                    width={16}
                    height={16}
                />
            </Badge>
            {visibleTags.map((tag, index) => {
                // Find the matching tag object for color styling (skip first tag which is category)
                const tagObj = index > 0 && tagObjects ? tagObjects.find(t => t.name === tag) : null
                return (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                        style={
                            tagObj?.color
                                ? {
                                      backgroundColor: `${tagObj.color}20`,
                                      borderColor: tagObj.color,
                                      borderWidth: '1px',
                                      color: tagObj.color,
                                  }
                                : {}
                        }
                    >
                        {tag}
                    </Badge>
                )
            })}
            {hiddenCount > 0 && (
                <Badge variant="secondary" className="text-xs text-muted-foreground">
                    +{hiddenCount} more
                </Badge>
            )}
        </div>
    )
}

interface AssetItemProps {
    asset: Asset
    variant?: 'card' | 'list'
    className?: string
}

export function AssetItem({ asset, variant = 'card', className }: AssetItemProps) {
    const [showSuggestive, setShowSuggestive] = useState(false)
    const allTags = [asset.categoryName, ...asset.tags.map(tag => tag.name)]

    const dispatch = useAppDispatch()
    const assetState = useAppSelector(state => state.assets)
    const isSelected = isAssetSelected(assetState, asset)
    const { mode } = assetState

    const handleSelectionToggle = () => {
        // Check if we're trying to select (not deselect) and if we're at the limit
        if (!isSelected && assetState.selectedAssets.length >= 500) {
            toast.error('Selection limit reached', {
                description: 'You can only select up to 500 assets at once to prevent instability.',
            })
            return
        }
        dispatch(toggleAssetSelection(asset))
    }

    const handleItemClick = (e: React.MouseEvent) => {
        if (mode === 'multi-select') {
            e.preventDefault()
            handleSelectionToggle()
        }
        // In view mode, allow default Link behavior
    }

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored !== null) {
            setShowSuggestive(stored === 'true')
        }
    }, [])

    const formatFileSize = (sizeInBytes: number) => {
        const sizeInMB = sizeInBytes / (1024 * 1024)
        if (sizeInMB < 1) {
            const sizeInKB = sizeInBytes / 1024
            return `${Math.round(sizeInKB)}KB`
        }
        return `${sizeInMB.toFixed(1)}MB`
    }

    if (variant === 'list') {
        return (
            <div
                className={cn(
                    `relative flex items-center gap-4 p-4 border rounded-lg bg-card background-blur-lg  hover:border-foreground transition-all duration-150 cursor-pointer break-inside-avoid`,
                    className,
                )}
            >
                <Link href={`/asset/${asset.id}`} className="flex items-center gap-4 w-full" onClick={handleItemClick}>
                    <div className="relative flex items-center gap-4 w-full">
                        <div className="flex-shrink-0 w-20 h-20 rounded bg-secondary flex items-center justify-center p-2">
                            <img
                                src={
                                    'https://pack.skowt.cc/cdn-cgi/image/width=300,quality=70/asset/' +
                                    asset.id +
                                    '.' +
                                    asset.extension
                                }
                                alt={asset.name}
                                className={`max-w-full max-h-full object-contain ${asset.isSuggestive && !showSuggestive ? 'blur-lg' : ''}`}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`font-medium text-base truncate transition-all duration-150 inline-block w-fit ${
                                            isSelected ? 'bg-accent text-accent-foreground px-2 rounded' : ''
                                        } ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        {asset.name}
                                    </h3>
                                    <div
                                        className={`flex items-center gap-2 mt-1 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        <Badge variant="secondary" className="text-xs">
                                            <Image
                                                src={`https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/${asset.gameSlug}-icon.png`}
                                                alt={asset.gameName}
                                                width={16}
                                                height={16}
                                                className="rounded-sm"
                                            />
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            {asset.categoryName}
                                        </Badge>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 mt-2 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <HiOutlineCalendar className="h-3 w-3" />
                                            <span>
                                                {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex flex-row gap-1 items-center">
                                            <HiOutlineDocument className="h-3 w-3" />
                                            {formatFileSize(asset.size)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {asset.isSuggestive && !showSuggestive && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg flex items-center justify-center">
                            <div className="flex flex-col text-center items-center px-4">
                                <EyeOffIcon size={24} className="mb-2" />
                                <p className="text-sm font-medium text-foreground">Potentially Suggestive Content</p>
                                <p className="text-sm text-muted-foreground">Please enable in settings to view</p>
                            </div>
                        </div>
                    )}
                </Link>
            </div>
        )
    }

    return (
        <div
            className={cn(
                `relative bg-card rounded-lg border overflow-hidden hover:border-foreground transition-all duration-150 mb-2 break-inside-avoid`,
                className,
            )}
        >
            <Link href={`/asset/${asset.id}`} onClick={handleItemClick}>
                <div className="relative p-2">
                    <div className="p-2">
                        <div
                            className="bg-secondary relative rounded-md overflow-hidden flex items-center justify-center p-4"
                            style={{ minHeight: '200px' }}
                        >
                            <img
                                src={
                                    'https://pack.skowt.cc/cdn-cgi/image/width=300,quality=70/asset/' +
                                    asset.id +
                                    '.' +
                                    asset.extension
                                }
                                alt={asset.name}
                                className={`max-w-full max-h-full object-contain ${asset.isSuggestive && !showSuggestive ? 'blur-lg' : ''}`}
                                style={{ maxHeight: '250px' }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="px-4 pt-2">
                            <h3
                                className={`font-semibold text-sm truncate transition-all duration-150 inline-block w-fit max-w-full ${
                                    isSelected ? 'bg-accent text-accent-foreground px-2 rounded' : ''
                                } ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                            >
                                {asset.name}
                            </h3>
                        </div>
                        <div className={`px-4 pb-3 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}>
                            <DynamicTagDisplay
                                tags={allTags}
                                gameSlug={asset.gameSlug}
                                gameName={asset.gameName}
                                tagObjects={asset.tags}
                            />
                        </div>
                    </div>
                    {asset.isSuggestive && !showSuggestive && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg flex items-center justify-center">
                            <div className="flex flex-col text-center items-center px-4">
                                <EyeOffIcon size={24} className="mb-2" />
                                <p className="text-sm font-medium text-foreground">Potentially Suggestive Content</p>
                                <p className="text-sm text-muted-foreground">Please enable in settings to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}
