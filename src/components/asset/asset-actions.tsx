'use client'

import { Button } from '~/components/ui/button'
import { DownloadIcon, HeartIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '~/lib/redux/store'
import { toggleAssetSelection } from '~/lib/redux/slices/asset-slice'
import { isAssetSelected } from '~/lib/redux/utils'
import { client } from '~/lib/api/client'
import { authClient } from '~/lib/auth/auth-client'
import { useEffect, useState } from 'react'
import { HiOutlineClipboard } from 'react-icons/hi'
import { toast } from 'sonner'

type Asset = {
    id: string
    name: string
    downloadCount: number
    viewCount: number
    size: number
    extension: string
    createdAt: string
    isSuggestive: boolean
    game: {
        id: string
        name: string
        slug: string
    }
    category: {
        id: string
        name: string
        slug: string
    }
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

interface AssetActionsProps {
    asset: Asset
    className?: string
}

export function AssetActions({ asset, className }: AssetActionsProps) {
    const [isSaved, setIsSaved] = useState(false)

    const dispatch = useAppDispatch()
    const assetState = useAppSelector(state => state.assets)

    const { data: session } = authClient.useSession()
    const user = session?.user

    useEffect(() => {
        const checkSavedAsset = async () => {
            const checkSavedAssetResponse = await client.get(`/user/check-saved-asset/{id}`, {
                path: { id: asset.id },
            })
            setIsSaved(checkSavedAssetResponse.savedAsset ? true : false)
        }
        checkSavedAsset()
    }, [asset.id])

    // Adapt the asset object to match Redux slice expectations for checking selection
    const adaptedAsset = {
        id: asset.id,
        name: asset.name,
        gameId: asset.game.id,
        gameName: asset.game.name,
        gameSlug: asset.game.slug,
        categoryId: asset.category.id,
        categoryName: asset.category.name,
        categorySlug: asset.category.slug,
        downloadCount: asset.downloadCount,
        viewCount: asset.viewCount,
        size: asset.size,
        extension: asset.extension,
        createdAt: asset.createdAt,
        isSuggestive: asset.isSuggestive,
        tags: asset.tags,
        uploadedBy: asset.uploadedBy,
    }

    const isSelected = isAssetSelected(assetState, adaptedAsset)

    const handleDownload = () => {
        // Direct download logic
        const downloadUrl = `https://pack.skowt.cc/asset/${asset.id}.${asset.extension}`
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${asset.name}.${asset.extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText('https://skowt.cc/asset/' + asset.id)
            toast.success('Asset URL copied to clipboard!')
        } catch (error) {
            toast.error('Failed to copy Asset URL to clipboard.')
        }
    }

    const handleSave = () => {
        if (isSaved) {
            client.delete(`/user/saved-assets/{assetId}`, {
                path: { assetId: asset.id },
            })
        } else {
            client.post(`/user/saved-assets/{id}`, {
                path: { id: asset.id },
            })
        }
        setIsSaved(!isSaved)
    }

    const handleSelect = () => {
        dispatch(toggleAssetSelection(adaptedAsset))
    }

    return (
        <div className={`flex flex-col gap-2 p-4 bg-card rounded-lg border ${className}`}>
            <Button onClick={handleDownload} className="hover:cursor-pointer">
                <DownloadIcon className="h-4 w-4" />
                Download Asset
            </Button>
            <Button variant="secondary" onClick={handleSelect} className="hover:cursor-pointer">
                {isSelected ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                {isSelected ? 'Deselect Asset' : 'Select Asset'}
            </Button>
            <Button variant="secondary" onClick={handleSave} className="hover:cursor-pointer" disabled={!user}>
                <HeartIcon fill={isSaved ? 'currentColor' : 'none'} className="h-4 w-4" />
                {isSaved ? 'Unsave Asset' : 'Save Asset'}
            </Button>
            <Button onClick={copyToClipboard} variant="secondary" className="hover:cursor-pointer">
                <HiOutlineClipboard className="h-4 w-4" />
                Copy Asset URL
            </Button>
        </div>
    )
}
