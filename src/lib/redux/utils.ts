import { IAssetState } from './slices/asset-slice'

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

export const isAssetSelected = (assetState: IAssetState, asset: Asset): boolean => {
    return assetState.selectedAssets.some(selectedAsset => selectedAsset.id === asset.id)
}
