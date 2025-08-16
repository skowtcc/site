import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Use the Asset type from the API schema
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

export interface IAssetState {
    isMassDownloading: boolean
    selectedAssets: Asset[]
    mode: 'view' | 'multi-select'
}

const initialState: IAssetState = {
    isMassDownloading: false,
    selectedAssets: [],
    mode: 'view',
}

export const assetSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        setSelectedAssets: (state, action: PayloadAction<Asset[]>) => {
            state.selectedAssets = action.payload || []
        },
        setIsMassDownloading: (state, action: PayloadAction<boolean>) => {
            state.isMassDownloading = action.payload || false
        },
        toggleAssetSelection: (state, action: PayloadAction<Asset>) => {
            if (state.isMassDownloading) return

            const index = state.selectedAssets.findIndex(asset => asset.id === action.payload.id)
            if (index >= 0) {
                // Always allow deselection
                state.selectedAssets.splice(index, 1)
            } else {
                // Check limit before adding (500 assets max)
                if (state.selectedAssets.length >= 500) {
                    // Don't add more if at limit
                    return
                }
                state.selectedAssets.push(action.payload)
            }
        },
        clearSelectedAssets: state => {
            state.selectedAssets = []
        },
        setMode: (state, action: PayloadAction<'view' | 'multi-select'>) => {
            state.mode = action.payload
            // Keep selections when switching modes
        },
    },
})

export const { setSelectedAssets, setIsMassDownloading, toggleAssetSelection, clearSelectedAssets, setMode } =
    assetSlice.actions

export default assetSlice
