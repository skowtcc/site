'use client'

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import axios from 'axios'

type Asset = {
    id: string
    name: string
    extension: string
    gameSlug: string
    categoryName: string
}

interface DownloadProgress {
    current: number
    total: number
    currentAsset: string
    status: 'downloading' | 'zipping' | 'complete' | 'error'
}

export const downloadAssetsAsZip = async (
    assets: Asset[],
    onProgress?: (progress: DownloadProgress) => void,
): Promise<void> => {
    if (assets.length === 0) {
        throw new Error('No assets selected for download')
    }

    const zip = new JSZip()
    let downloaded = 0

    try {
        onProgress?.({
            current: 0,
            total: assets.length,
            currentAsset: '',
            status: 'downloading',
        })

        // Download all assets and add them to the ZIP
        for (const asset of assets) {
            const assetUrl = `https://pack.skowt.cc/asset/${asset.id}.${asset.extension}`

            onProgress?.({
                current: downloaded,
                total: assets.length,
                currentAsset: asset.name,
                status: 'downloading',
            })

            try {
                const response = await axios.get('https://bridge.skowt.cc/?url=' + assetUrl, {
                    responseType: 'arraybuffer',
                    withCredentials: false,
                })

                const blob = new Blob([response.data])

                // Create a folder structure: game/category/filename
                const folderPath = `${asset.gameSlug}/${asset.categoryName}`
                const filename = `${asset.name}.${asset.extension}`

                zip.folder(folderPath)?.file(filename, blob)
                downloaded++
            } catch (error) {
                console.warn(`Failed to download ${asset.name}:`, error)
                // Continue with other assets even if one fails
            }
        }

        if (downloaded === 0) {
            throw new Error('Failed to download any assets')
        }

        onProgress?.({
            current: downloaded,
            total: assets.length,
            currentAsset: '',
            status: 'zipping',
        })

        // Generate the ZIP file
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6,
            },
        })

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
        const filename = `skowt-cc-assets-${timestamp}.zip`

        onProgress?.({
            current: downloaded,
            total: assets.length,
            currentAsset: '',
            status: 'complete',
        })

        // Download the ZIP file
        saveAs(content, filename)
    } catch (error) {
        onProgress?.({
            current: downloaded,
            total: assets.length,
            currentAsset: '',
            status: 'error',
        })
        throw error
    }
}
