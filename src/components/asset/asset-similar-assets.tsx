'use client'

import { useEffect, useState } from 'react'
import { AssetItem } from './asset-item'
import { client } from '~/lib/api/client'

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

interface SimilarAssetsProps {
    currentAssetId: string
    gameSlug: string
    categorySlug: string
    gameName: string
    categoryName: string
}

export function SimilarAssets({ currentAssetId, gameSlug, categorySlug, gameName, categoryName }: SimilarAssetsProps) {
    const [similarAssets, setSimilarAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSimilarAssets = async () => {
            try {
                const params = new URLSearchParams()
                params.append('games', gameSlug)
                params.append('categories', categorySlug)
                params.append('sortBy', 'uploadDate')
                params.append('sortOrder', 'desc')

                const response = await client.get('/asset/search', {
                    query: Object.fromEntries(params),
                })

                if (response.assets) {
                    // Filter out the current asset and limit to 3 results
                    const filteredAssets = response.assets
                        .filter((asset: Asset) => asset.id !== currentAssetId)
                        .slice(0, 6)

                    setSimilarAssets(filteredAssets)
                }
            } catch (error) {
                console.error('Failed to fetch similar assets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSimilarAssets()
    }, [currentAssetId, gameSlug, categorySlug])

    // Don't render if no similar assets found
    if (!loading && similarAssets.length === 0) {
        return null
    }

    if (loading) {
        return (
            <div className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-muted/50 rounded-lg h-20 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
                {similarAssets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} variant="list" className="w-full" />
                ))}
            </div>
        </div>
    )
}
