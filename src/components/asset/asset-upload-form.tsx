'use client'

import { client } from '~/lib/api/client'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useMemo } from 'react'
import { type Endpoints } from '~/lib/api/schema/api.zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { authClient } from '~/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

type Game = Endpoints.get__game_all['response']['games'][0]
type Category = Endpoints.get__category_all['response']['categories'][0]
type Tag = Endpoints.get__tag_all['response']['tags'][0]

const schema = z.object({
    name: z.string().min(1, 'Asset name is required'),
    gameId: z.string().min(1, 'Game selection is required'),
    categoryId: z.string().min(1, 'Category selection is required'),
    isSuggestive: z.boolean(),
    tags: z.string().optional(),
    file: z.any().refine(files => files?.length > 0, 'File is required'),
})

export function AssetUploadForm() {
    const [categories, setCategories] = useState<Category[]>([])
    const [games, setGames] = useState<Game[]>([])
    const [isCategoryDisabled, setIsCategoryDisabled] = useState<boolean>(true)
    const [tags, setTags] = useState<Tag[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { data: session } = authClient.useSession()
    const user = session?.user
    const router = useRouter()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            gameId: '',
            categoryId: '',
            isSuggestive: false,
            tags: '',
        },
        mode: 'onChange',
    })

    const selectedGameId = form.watch('gameId')
    const selectedFile = form.watch('file')

    const availableCategories = useMemo(() => {
        if (!selectedGameId) {
            return []
        }

        const selectedGame = games.find(game => game.id === selectedGameId)
        if (!selectedGame) {
            return []
        }

        return categories.filter(category =>
            selectedGame.categories.some(gameCategory => gameCategory.id === category.id),
        )
    }, [categories, games, selectedGameId])

    // Handle image preview
    useEffect(() => {
        if (selectedFile && selectedFile[0] && selectedFile[0].type.startsWith('image/')) {
            const file = selectedFile[0]
            const reader = new FileReader()
            reader.onload = e => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }, [selectedFile])

    useEffect(() => {
        if (selectedGameId) {
            const currentCategoryId = form.getValues('categoryId')
            const isCategoryValid = availableCategories.some(cat => cat.id === currentCategoryId)
            setIsCategoryDisabled(!selectedGameId || availableCategories.length === 0)

            if (!isCategoryValid) {
                form.setValue('categoryId', '', { shouldValidate: true })
            }
        } else {
            setIsCategoryDisabled(true)
        }
    }, [selectedGameId, availableCategories, form])

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesResponse = await client.get('/category/all')
            setCategories(categoriesResponse.categories)
        }

        const fetchGames = async () => {
            const gamesResponse = await client.get('/game/all')
            setGames(gamesResponse.games)
        }

        const fetchTags = async () => {
            const tagsResponse = await client.get('/tag/all')
            setTags(tagsResponse.tags)
        }

        fetchCategories()
        fetchGames()
        fetchTags()
    }, [])

    const onSubmit = async (data: z.infer<typeof schema>) => {
        if (!user) {
            router.push('/login')
            return
        }

        // Check if user has permission to upload
        if (user.role !== 'contributor' && user.role !== 'admin') {
            toast.error('Access denied', {
                description: 'Only contributors and admins can upload assets.',
            })
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('gameId', data.gameId)
            formData.append('categoryId', data.categoryId)
            formData.append('isSuggestive', String(data.isSuggestive))
            if (data.tags) {
                formData.append(
                    'tags',
                    data.tags
                        .split(',')
                        .map(tag => tag.trim())
                        .join(','),
                )
            }
            if (data.file && data.file[0]) {
                formData.append('file', data.file[0])
            }

            const response = await fetch('https://den.skowt.cc/asset/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            const result = await response.json()

            if (result.success) {
                if (user.role === 'admin') {
                    toast.success('Asset uploaded successfully! Redirecting..')
                    setTimeout(() => {
                        router.push(`/asset/${result.asset.id}`)
                    }, 3000)
                } else {
                    toast.success('Asset added to approval queue.')
                    setTimeout(() => {
                        router.push(`/upload`)
                    }, 3000)
                }
            } else {
                toast.error('Failed to upload asset')
            }
        } catch (error) {
            console.error(error)
            toast.error('Upload failed')
        }
    }

    // Redirect unauthorized users
    useEffect(() => {
        if (!user || (user.role !== 'contributor' && user.role !== 'admin')) {
            router.push('/')
        }
    }, [user, router])

    // Don't render form for unauthorized users
    if (!user || (user.role !== 'contributor' && user.role !== 'admin')) {
        return null
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 p-6 bg-card rounded-lg border">
                <h2 className="text-lg font-bold">Asset Upload FAQ</h2>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <p>All contributors can upload assets - currently, the site just supports JPEG/PNG/JPG files.</p>
                    <p>
                        Categories have links to games, so you can only select categories that are linked to the game
                        you select.
                    </p>
                    <p>Support for additional formats is in development, though there's no timeline yet.</p>
                    <p>All asset uploads require approval before they are visible to the public.</p>
                    <p>The approval process usually takes around 12-24 hours.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <div className={`w-full lg:w-1/3 ${imagePreview ? 'block' : 'hidden lg:block'}`}>
                    <div
                        className="p-6 rounded-lg bg-background/60 border border-border h-full flex flex-col items-center justify-center min-h-[300px]"
                        style={{
                            backgroundImage: `url(/checkered.svg)`,
                            backgroundSize: `400px 400px`,
                        }}
                    >
                        {imagePreview ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Image
                                    src={imagePreview}
                                    alt="Asset Preview"
                                    width={400}
                                    height={400}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    style={{ aspectRatio: 'auto' }}
                                />
                            </div>
                        ) : (
                            <div className="text-center bg-card rounded-lg border p-6">
                                <p className="text-lg mb-2 font-semibold">No preview available</p>
                                <p className="text-sm text-muted-foreground">
                                    A preview will be shown here once you upload an image.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section - 2/3 width on lg+ */}
                <div className="w-full lg:w-2/3">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6 p-6 bg-card rounded-lg border">
                            <div className="flex flex-col gap-2">
                                <Label>Asset Name</Label>
                                <Input
                                    type="text"
                                    {...form.register('name')}
                                    placeholder="e.g 'Hu Tao No Background'"
                                />
                                {form.formState.errors.name && (
                                    <span className="text-sm text-red-500">{form.formState.errors.name.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>File</Label>
                                <Input type="file" {...form.register('file')} accept="image/*" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Game</Label>
                                    <Select
                                        onValueChange={value =>
                                            form.setValue('gameId', value, { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a game" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {games.map(game => (
                                                <SelectItem key={game.id} value={game.id}>
                                                    {game.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.gameId && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.gameId.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Category</Label>
                                    <Select
                                        disabled={isCategoryDisabled}
                                        onValueChange={value =>
                                            form.setValue('categoryId', value, { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    isCategoryDisabled ? 'Select a game first' : 'Select a category'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableCategories.map(category => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.categoryId && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.categoryId.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Tags</Label>
                                    <Select
                                        onValueChange={value => form.setValue('tags', value, { shouldValidate: true })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tags.map(tag => (
                                                <SelectItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-row items-center justify-between gap-4">
                                <Label className="text-sm">Is This Asset Suggestive (NSFW/Triggering/Gore/etc)?</Label>
                                <Checkbox
                                    checked={form.watch('isSuggestive')}
                                    onCheckedChange={checked => {
                                        form.setValue('isSuggestive', !!checked, { shouldValidate: true })
                                    }}
                                />
                            </div>

                            <div className="flex flex-row gap-3 pt-2">
                                <Button type="submit" className="flex-1" disabled={!form.formState.isValid}>
                                    Upload
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
