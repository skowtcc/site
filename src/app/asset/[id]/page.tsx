import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import { Badge } from '~/components/ui/badge'
import {
    Download,
    Eye,
    Calendar,
    User,
    HomeIcon,
    GavelIcon,
    UserIcon,
    StarIcon,
    CodeIcon,
    CodeXmlIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { client } from '~/lib/api/client'
import { notFound } from 'next/navigation'
import { AssetImage } from '~/components/asset/asset-image'
import { AssetActions } from '~/components/asset/asset-actions'
import { SimilarAssets } from '~/components/asset/asset-similar-assets'
import Link from 'next/link'

export const runtime = 'edge'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = await params

    try {
        const response = await client.get('/asset/{id}', {
            path: { id },
        })

        console.log(response)

        if (!response.success) {
            return {
                title: `Asset Not Found - skowt.cc`,
                description: `Asset ${id} not found`,
            }
        }

        return {
            title: `${response.asset.name} - ${response.asset.game.name} - skowt.cc`,
            description: `Download and view ${response.asset.name} for ${response.asset.game.name} on skowt.cc.`,
        }
    } catch (error) {
        return {
            title: `Asset - skowt.cc`,
            description: `View asset on skowt.cc`,
        }
    }
}

export default async function Page({ params }: Props) {
    const { id } = await params

    console.log(id)
    let response
    try {
        response = await client.get('/asset/{id}', {
            path: { id },
        })

        if (!response.success) {
            notFound()
        }
    } catch (error) {
        console.error('Failed to fetch asset:', error)
        notFound()
    }

    const asset = response.asset

    const formatFileSize = (sizeInBytes: number) => {
        const sizeInKB = sizeInBytes / 1024
        if (sizeInKB < 1024) {
            return `${sizeInKB.toFixed(1)}KB`
        }
        const sizeInMB = sizeInKB / 1024
        if (sizeInMB < 1024) {
            return `${sizeInMB.toFixed(1)}MB`
        }
        const sizeInGB = sizeInMB / 1024
        return `${sizeInGB.toFixed(1)}GB`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div className="flex flex-col gap-2 p-6 min-h-screen">
            <div className="flex lg:flex-row flex-col gap-6">
                <div className="lg:w-1/2">
                    <div className="bg-card border border-border rounded-lg p-4 xl:h-full">
                        <div
                            className="p-6 lg:p-12 rounded-lg bg-background/60 border border-border xl:h-full xl:flex xl:flex-col"
                            style={{
                                backgroundImage: `url(/checkered.svg)`,
                                backgroundSize: `400px 400px`,
                            }}
                        >
                            {}
                            <AssetImage
                                assetId={asset.id}
                                extension={asset.extension}
                                name={asset.name}
                                isSuggestive={asset.isSuggestive}
                                className="xl:flex-1 aspect-square overflow-hidden"
                            />
                        </div>
                    </div>
                </div>

                {}
                <div className="flex flex-col gap-4 lg:w-1/2 w-full xl:h-full">
                    <AssetActions asset={asset} className="xl:hidden" />

                    <div className="bg-card rounded-xl p-6 xl:flex-1">
                        <div className="space-y-6 pb-6 border-b border-border/50">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                                    {asset.name}
                                </h1>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-sm font-medium">{asset.game.name}</span>
                                    <span className="text-muted-foreground/60">·</span>
                                    <span className="text-sm">{asset.category.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground/80">
                                <span className="text-xs">Uploaded by</span>
                                {asset.uploadedBy.image && (
                                    <Image
                                        src={asset.uploadedBy.image}
                                        alt={asset.uploadedBy.username || 'unknown'}
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                )}
                                <span className="text-xs font-medium text-foreground">
                                    {asset.uploadedBy.username || 'unknown user'}
                                </span>
                            </div>
                        </div>

                        {asset.tags.length > 0 && (
                            <div className="py-4 border-b border-border/50">
                                <div className="flex flex-wrap gap-2">
                                    {asset.tags.map(tag => (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                                            style={
                                                tag.color
                                                    ? {
                                                          backgroundColor: `${tag.color}15`,
                                                          borderColor: `${tag.color}40`,
                                                          borderWidth: '1px',
                                                          color: tag.color,
                                                      }
                                                    : {}
                                            }
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 grid grid-cols-3 gap-3">
                            <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Type</div>
                                <div className="text-sm font-semibold uppercase tracking-wide">{asset.extension}</div>
                            </div>

                            <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Size</div>
                                <div className="text-sm font-semibold">{formatFileSize(asset.size)}</div>
                            </div>

                            <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
                                <div className="text-xs text-muted-foreground font-medium mb-1">Uploaded</div>
                                <div className="text-sm font-semibold">
                                    {new Date(asset.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 xl:flex-1">
                        <AssetActions asset={asset} className="hidden xl:flex" />
                    </div>
                </div>
            </div>

            <SimilarAssets
                currentAssetId={asset.id}
                gameSlug={asset.game.slug}
                categorySlug={asset.category.slug}
                gameName={asset.game.name}
                categoryName={asset.category.name}
            />
        </div>
    )
}
