import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { client } from '~/lib/api/client'
import { notFound } from 'next/navigation'
import { AssetImage } from '~/components/asset/asset-image'
import { AssetActions } from '~/components/asset/asset-actions'

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
                description: `Asset ${id} not found on skowt.cc`,
            }
        }

        return {
            title: `${response.asset.name} - ${response.asset.game.name} - skowt.cc`,
            description: `Download ${response.asset.name} for ${response.asset.game.name} on skowt.cc. ${response.asset.downloadCount} downloads, ${response.asset.viewCount} views.`,
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

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div className="flex flex-col gap-4 p-6 min-h-screen">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            <HomeIcon className="h-4 w-4" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/?games=${asset.game.slug}`}>{asset.game.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/?categories=${asset.category.slug}`}>
                            {asset.category.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{asset.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex lg:flex-row flex-col gap-6">
                {}
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
                    {/* Action Buttons - Show first on mobile/tablet */}
                    <AssetActions asset={asset} className="xl:hidden" />

                    <div className="bg-card border border-border rounded-lg p-4 xl:flex-1">
                        <h3 className="text-lg font-semibold mb-4">Asset Details</h3>

                        <div className="space-y-4">
                            {}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/2">Property</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Asset Name</TableCell>
                                        <TableCell className="font-mono text-sm">{asset.name}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-secondary/50">
                                        <TableCell className="font-medium">Game</TableCell>
                                        <TableCell className="text-sm flex items-center gap-2">
                                            <Image
                                                src={`https://pack.skowt.cc/cdn-cgi/image/width=64,height=64,quality=75/game/${asset.game.slug}-icon.png`}
                                                alt={asset.game.name}
                                                width={20}
                                                height={20}
                                                className="rounded-md"
                                            />
                                            {asset.game.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Category</TableCell>
                                        <TableCell className="text-sm">{asset.category.name}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-secondary/50">
                                        <TableCell className="font-medium">File Size</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {formatFileSize(asset.size)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">File Type</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{asset.extension.toUpperCase()}</Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-secondary/50">
                                        <TableCell className="font-medium">Tags</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {asset.tags.map(tag => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant="secondary"
                                                        className="text-xs bg-muted"
                                                        style={
                                                            tag.color
                                                                ? { backgroundColor: tag.color, color: 'white' }
                                                                : {}
                                                        }
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Upload Date</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(asset.createdAt)}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-secondary/50">
                                        <TableCell className="font-medium">Uploader</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>{asset.uploadedBy.username || asset.uploadedBy.id}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Downloads</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            {/* <span>{formatNumber(asset.downloadCount)}</span> */}
                                            <span>Not enough data</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-secondary/50">
                                        <TableCell className="font-medium">Views</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Eye className="h-4 w-4" />
                                            {/* <span>{formatNumber(asset.viewCount)}</span> */}
                                            <span>Not enough data</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 xl:flex-1">
                        <div className="flex flex-col gap-2 bg-card border border-border rounded-lg mb-2 xl:flex-1">
                            <div className="flex flex-col p-4 xl:flex-1">
                                <p className="text-lg font-medium mb-4">Uploader Details</p>
                                <div className="flex flex-row gap-4 items-center">
                                    <div className="size-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {asset.uploadedBy.image ? (
                                            <Image
                                                src={asset.uploadedBy.image}
                                                alt={asset.uploadedBy.username || 'User'}
                                                width={64}
                                                height={64}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <p>@{asset.uploadedBy.username}</p>
                                        {}
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-primary text-primary-foreground"
                                        >
                                            {asset.uploadedBy.username == 'dromzeh' ? (
                                                <>
                                                    <CodeXmlIcon size={20} />
                                                    DEVELOPER
                                                </>
                                            ) : (
                                                <>
                                                    <StarIcon size={20} />
                                                    CONTRIBUTOR
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AssetActions asset={asset} className="hidden xl:flex" />
                    </div>
                </div>
            </div>
        </div>
    )
}
