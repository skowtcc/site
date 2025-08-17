'use client'

import { Badge } from '~/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'
import { client } from '~/lib/api/client'
import { z } from 'zod'
import { type Endpoints } from '~/lib/api/schema/api.zod'
import { formatDistanceToNow } from 'date-fns'

type Asset = Endpoints.get__asset_search['response']['assets'][0]

export function RecentlyUploadedCarousel() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRecentAssets = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await client.get('/asset/search', {
                    query: {
                        sortBy: 'uploadDate',
                        sortOrder: 'desc',
                        limit: '10',
                        page: '1',
                    },
                })

                setAssets(response.assets)
            } catch (err) {
                console.error('Failed to fetch recent assets:', err)
                setError('Failed to load recently uploaded assets')
            } finally {
                setLoading(false)
            }
        }

        fetchRecentAssets()
    }, [])

    if (loading) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-6">
                    <h2 className="text-2xl font-semibold">Recently Uploaded</h2>
                </div>
                <div className="px-6">
                    <div className="animate-pulse flex space-x-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex-1 min-w-0">
                                <div className="h-24 bg-muted rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-6">
                    <h2 className="text-2xl font-semibold">Recently Uploaded</h2>
                </div>
                <div className="px-6">
                    <div className="p-4 border rounded-lg bg-destructive/10 text-destructive">{error}</div>
                </div>
            </div>
        )
    }

    if (!assets.length) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-6">
                    <h2 className="text-2xl font-semibold">Recently Uploaded</h2>
                </div>
                <div className="px-6">
                    <div className="p-4 border rounded-lg bg-muted/50 text-muted-foreground">
                        No recently uploaded assets found.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-6">
                <h2 className="text-2xl font-semibold">Recently Uploaded</h2>
            </div>

            <div className="px-6 overflow-hidden">
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    className="w-full max-w-full"
                >
                    <CarouselContent className="-ml-1 md:-ml-2">
                        {assets.map(asset => (
                            <CarouselItem key={asset.id} className="pl-1 md:pl-2 basis-full sm:basis-1/2 xl:basis-1/3">
                                <div className="relative flex items-center gap-3 p-3 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer min-w-0 overflow-hidden">
                                    {}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={`https://pack.skowt.cc/cdn-cgi/image/width=10,height=10,quality=10/asset/${asset.id}.${asset.extension}`}
                                            alt=""
                                            className="w-full h-full object-cover opacity-5 blur-sm"
                                        />
                                    </div>

                                    {}
                                    <div className="relative flex items-center gap-3 w-full">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={`https://pack.skowt.cc/cdn-cgi/image/width=100,height=100,quality=75/asset/${asset.id}.${asset.extension}`}
                                                alt={asset.name}
                                                className={`w-16 h-16 rounded object-cover ${asset.isSuggestive ? 'blur-lg' : ''}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-medium text-sm truncate ${asset.isSuggestive ? 'blur-sm' : ''}`}
                                            >
                                                {asset.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Uploaded{' '}
                                                {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                                            </p>
                                            <Badge variant="secondary" className="text-xs mt-1">
                                                {asset.categoryName}
                                            </Badge>
                                        </div>
                                    </div>

                                    {}
                                    {asset.isSuggestive && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg flex items-center justify-center">
                                            <div className="text-center px-2">
                                                <p className="text-xs font-medium text-foreground">
                                                    Suggestive Content
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {}
                    <div className="absolute -top-12 right-0 flex items-center gap-2">
                        <CarouselPrevious className="static translate-y-0 size-9 w-10 rounded-lg" />
                        <CarouselNext className="static translate-y-0 size-9 w-10 rounded-lg" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
