'use client'

import { useEffect, useState } from 'react'
import { client } from '~/lib/api/client'
import { authClient } from '~/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { type Endpoints } from '~/lib/api/schema/api.zod'
import { z } from 'zod'
import Image from 'next/image'
import { Button } from '~/components/ui/button'
import { CheckIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
    const { data: session } = authClient.useSession()
    const user = session?.user
    const router = useRouter()

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/')
        }
    }, [user])

    return (
        <div className="min-h-screen p-6">
            <div className="flex flex-col gap-6">
                <AssetApprovalQueue />
            </div>
        </div>
    )
}

type AssetQueueResponse = Endpoints.get__asset_approvalQueue['response']

function AssetApprovalQueue() {
    const [assetApprovalList, setAssetApprovalList] = useState<AssetQueueResponse['assets']>([])

    useEffect(() => {
        const fetchAssetApprovalList = async () => {
            const response = await client.get('/asset/approval-queue')
            if (response.success) {
                setAssetApprovalList(response.assets)
            }
        }

        fetchAssetApprovalList()
    }, [])

    const approveAsset = async (assetId: string) => {
        try {
            const response = await client.post('/asset/{id}/approve', {
                path: { id: assetId },
            })

            if (response && response.success) {
                // Remove asset from list on successful approval
                setAssetApprovalList(prev => prev.filter(asset => asset.id !== assetId))
                toast.success('Asset approved successfully')
            } else {
                toast.error('Failed to approve asset')
            }
        } catch (error) {
            toast.error('Error approving asset')
        }
    }

    const denyAsset = async (assetId: string) => {
        try {
            const response = await client.post('/asset/{id}/deny', {
                path: { id: assetId },
            })

            if (response && response.success) {
                // Remove asset from list on successful denial
                setAssetApprovalList(prev => prev.filter(asset => asset.id !== assetId))
                toast.success('Asset denied successfully')
            } else {
                toast.error('Failed to deny asset')
            }
        } catch (error) {
            toast.error('Error denying asset')
        }
    }

    const imageExtension = ['png', 'jpg']

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Asset Approval Queue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetApprovalList.map(asset => (
                    <div
                        className="bg-card p-4 text-muted-foreground flex flex-col gap-1 rounded-lg border"
                        key={asset.id}
                    >
                        <p className="text-xs font-mono">{asset.id}</p>
                        <div className="flex flex-row gap-1 justify-between items-center">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-md font-semibold text-foreground">
                                    {asset.name} [{asset.extension}]
                                </h3>
                                <p className="text-sm">Submitted by {asset.uploadedBy.username}</p>
                                <p className="text-sm">Game: {asset.game.name}</p>
                                <p className="text-sm">Category: {asset.category.name}</p>
                                <p className="text-sm">Tags: {asset.tags.map(tag => tag.name).join(', ')}</p>
                            </div>
                            {imageExtension.includes(asset.extension) && (
                                <div className="flex flex-row gap-2 mt-4">
                                    <Image
                                        src={`https://pack.skowt.cc/limbo/${asset.id}.${asset.extension}`}
                                        alt={asset.name}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => approveAsset(asset.id)}>
                                <CheckIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => denyAsset(asset.id)}>
                                <XIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
