'use client'

import { useAssetContext } from './asset-context'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Download, Eye, FileText, Calendar, Tag } from 'lucide-react'

export function AssetDetails() {
    const { assets } = useAssetContext()

    const formatFileSize = (sizeInMB: number) => {
        if (sizeInMB < 1) {
            return `${Math.round(sizeInMB * 1024)}KB`
        }
        return `${sizeInMB}MB`
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

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {}
            <div className="lg:w-1/2">
                <div className="border rounded-lg p-4 bg-card">
                    <div className="relative aspect-square border rounded-lg overflow-hidden bg-muted">
                        {assets.length > 0 ? (
                            <img
                                src={`https://pack.skowt.cc/asset/${assets[0].id}.${assets[0].extension}`}
                                alt={assets[0].name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>No image available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
            <div className="lg:w-1/2">
                <div className="border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-semibold mb-4">Asset Details</h3>

                    {assets.length > 0 ? (
                        <div className="space-y-4">
                            {}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/3">Property</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Asset Name</TableCell>
                                        <TableCell className="font-mono text-sm">{assets[0].name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">File Size</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {formatFileSize(assets[0].size)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Game</TableCell>
                                        <TableCell>{assets[0].gameName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Category</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{assets[0].categoryName}</Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Downloads</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            <span>{formatNumber(assets[0].downloadCount)}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Views</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Eye className="h-4 w-4" />
                                            <span>{formatNumber(assets[0].viewCount)}</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {}
                            <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {assets[0].tags.map(tag => (
                                        <Badge key={tag.id} variant="secondary" className="text-xs">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {}
                            <div className="flex gap-2 pt-4 border-t">
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                                    Download
                                </button>
                                <button className="px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            <p>No assets selected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
