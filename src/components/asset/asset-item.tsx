'use client'

import { Badge } from '~/components/ui/badge'
import { Download, Eye, FileText, DownloadIcon, EyeIcon, EyeOffIcon, CalendarIcon } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '~/lib/redux/store'
import { toggleAssetSelection } from '~/lib/redux/slices/asset-slice'
import { isAssetSelected } from '~/lib/redux/utils'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

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

function DynamicTagDisplay({ tags, gameSlug, gameName }: { tags: string[]; gameSlug: string; gameName: string }) {
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
                    src={'https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/' + gameSlug + '-icon.png'}
                    alt={gameName}
                    width={16}
                    height={16}
                />
            </Badge>
            {visibleTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                </Badge>
            ))}
            {hiddenCount > 0 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{hiddenCount} more
                </Badge>
            )}
        </div>
    )
}

interface AssetItemProps {
    asset: Asset
    variant?: 'card' | 'list'
}

export function AssetItem({ asset, variant = 'card' }: AssetItemProps) {
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

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    if (variant === 'list') {
        return (
            <div
                className={`relative flex items-center gap-4 p-4 border rounded-lg bg-card hover:border-3 hover:border-primary transition-all duration-150 cursor-pointer ${isSelected ? 'border-3 border-primary' : ''}`}
            >
                <Link href={`/asset/${asset.id}`} className="flex items-center gap-4 w-full" onClick={handleItemClick}>
                    <div className="absolute inset-0">
                        <img
                            src={'https://pack.skowt.cc/cdn-cgi/image/width=100,quality=10/asset/' + asset.id + '.' + asset.extension}
                            alt=""
                            className="w-full h-full object-cover opacity-5 blur-sm"
                        />
                    </div>

                    <div className="relative flex items-center gap-4 w-full">
                        <div className="flex-shrink-0">
                            <img
                                src={'https://pack.skowt.cc/cdn-cgi/image/width=100,quality=10/asset/' + asset.id + '.' + asset.extension}
                                alt={asset.name}
                                className={`w-20 h-20 rounded object-cover ${asset.isSuggestive && !showSuggestive ? 'blur-lg' : ''}`}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`font-medium text-base truncate ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        {asset.name}
                                    </h3>
                                    <p
                                        className={`text-sm text-muted-foreground mt-1 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        {asset.gameName} • {asset.categoryName}
                                    </p>
                                    <div
                                        className={`flex items-center gap-2 mt-2 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                    >
                                        {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <DownloadIcon size={14} />
                                            <span>{formatNumber(asset.downloadCount)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <EyeIcon size={14} />
                                            <span>{formatNumber(asset.viewCount)}</span>
                                        </div> */}
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatFileSize(asset.size)}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`hidden sm:flex flex-col items-end gap-2 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                                >
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {asset.tags.slice(0, 3).map(tag => (
                                            <Badge key={tag.id} variant="secondary" className="text-xs">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                        {asset.tags.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{asset.tags.length - 3} more
                                            </Badge>
                                        )}
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
            className={`relative bg-card rounded-lg border overflow-hidden hover:border-3 hover:border-primary transition-all duration-150 mb-4 ${isSelected ? 'border-3 border-primary' : ' '}`}
        >
            <Link href={`/asset/${asset.id}`} onClick={handleItemClick}>
                <div className="absolute inset-0">
                    <img
                        src={'https://pack.skowt.cc/cdn-cgi/image/width=100,quality=10/asset/' + asset.id + '.' + asset.extension}
                        alt=""
                        className="w-full h-full object-cover opacity-5 blur-sm"
                    />
                </div>

                <div className="relative">
                    <div className="p-2">
                        <div className="bg-muted relative rounded-md overflow-hidden">
                            <img
                                src={'https://pack.skowt.cc/cdn-cgi/image/width=300,quality=70/asset/' + asset.id + '.' + asset.extension}
                                alt={asset.name}
                                className={`w-full h-auto object-cover ${asset.isSuggestive && !showSuggestive ? 'blur-lg' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3
                            className={`px-4 pt-2 font-semibold text-sm line-clamp-1 overflow-hidden text-ellipsis ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                        >
                            {asset.name}
                        </h3>
                        <div className={`px-4 ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}>
                            <DynamicTagDisplay tags={allTags} gameSlug={asset.gameSlug} gameName={asset.gameName} />
                        </div>
                        <div
                            className={`flex px-4 p-4 items-center mt-4 border-t justify-between text-xs text-muted-foreground ${asset.isSuggestive && !showSuggestive ? 'blur-sm' : ''}`}
                        >
                            {/* <div className="flex flex-row items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Download className="h-3 w-3" />
                                    <span>{asset.downloadCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{asset.viewCount}</span>
                                </div>
                            </div> */}
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{formatFileSize(asset.size)}</span>
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
                </div>
            </Link>
        </div>
    )
}
