export namespace Schemas {
    // <Schemas>
    // </Schemas>
}

export namespace Endpoints {
    // <Endpoints>

    export type get__asset_search = {
        method: 'GET'
        path: '/asset/search'
        requestFormat: 'json'
        parameters: {
            query: Partial<{
                name: string
                tags: string
                games: string
                categories: string
                page: string
                limit: string
                sortBy: 'viewCount' | 'downloadCount' | 'uploadDate' | 'name'
                sortOrder: 'asc' | 'desc'
            }>
        }
        response: {
            success: boolean
            assets: Array<{
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
                tags: Array<{ id: string; name: string; slug: string; color: string | null }>
                uploadedBy: { id: string; username: string | null; image: string | null }
            }>
            pagination: {
                page: number
                limit: number
                total: number
                totalPages: number
                hasNext: boolean
                hasPrev: boolean
            }
        }
    }
    export type post__asset_history = {
        method: 'POST'
        path: '/asset/history'
        requestFormat: 'json'
        parameters: {
            body: { assetIds: Array<string> }
        }
        response: { success: boolean; historyId: string }
    }
    export type get__asset_history = {
        method: 'GET'
        path: '/asset/history'
        requestFormat: 'json'
        parameters: never
        response: { success: boolean; histories: Array<{ id: string; assetIds: Array<string>; createdAt: string }> }
    }
    export type get__asset_approvalQueue = {
        method: 'GET'
        path: '/asset/approval-queue'
        requestFormat: 'json'
        parameters: never
        response: {
            success: boolean
            assets: Array<{
                id: string
                name: string
                gameId: string
                categoryId: string
                extension: string
                status: string
                uploadedBy: { id: string; username: string | null; image: string | null }
                game: { id: string; slug: string; name: string; lastUpdated: string; assetCount: number }
                category: { id: string; name: string; slug: string }
                tags: Array<{ id: string; name: string; slug: string; color: string | null }>
            }>
        }
    }
    export type post__asset_Id_approve = {
        method: 'POST'
        path: '/asset/{id}/approve'
        requestFormat: 'json'
        parameters: {
            path: { id: string }
        }
        response: { success: boolean }
    }
    export type post__asset_Id_deny = {
        method: 'POST'
        path: '/asset/{id}/deny'
        requestFormat: 'json'
        parameters: {
            path: { id: string }
        }
        response: { success: boolean }
    }
    export type get__asset_Id = {
        method: 'GET'
        path: '/asset/{id}'
        requestFormat: 'json'
        parameters: {
            path: { id: string }
        }
        response: {
            success: boolean
            asset: {
                id: string
                name: string
                downloadCount: number
                viewCount: number
                size: number
                extension: string
                createdAt: string
                isSuggestive: boolean
                uploadedBy: { id: string; username: string | null; image: string | null }
                game: { id: string; slug: string; name: string; lastUpdated: string; assetCount: number }
                category: { id: string; name: string; slug: string }
                tags: Array<{ id: string; name: string; slug: string; color: string | null }>
            }
        }
    }
    export type post__asset_upload = {
        method: 'POST'
        path: '/asset/upload'
        requestFormat: 'form-data'
        parameters: {
            body: {
                name: string
                gameId: string
                categoryId: string
                isSuggestive?: string | undefined
                tags?: string | undefined
                file?: (unknown | null) | undefined
            }
        }
        response: {
            success: boolean
            asset: {
                id: string
                name: string
                status: string
                uploadedBy: { id: string; username: string | null; image: string | null }
            }
        }
    }
    export type get__game_all = {
        method: 'GET'
        path: '/game/all'
        requestFormat: 'json'
        parameters: never
        response: {
            success: boolean
            games: Array<{
                id: string
                slug: string
                name: string
                lastUpdated: string
                assetCount: number
                categories: Array<{ id: string; slug: string; name: string }>
            }>
        }
    }
    export type get__game_Slug = {
        method: 'GET'
        path: '/game/{slug}'
        requestFormat: 'json'
        parameters: {
            path: { slug: string }
        }
        response: {
            success: boolean
            game: {
                id: string
                slug: string
                name: string
                lastUpdated: string
                assetCount: number
                categories: Array<{ id: string; slug: string; name: string }>
            }
        }
    }
    export type get__category_all = {
        method: 'GET'
        path: '/category/all'
        requestFormat: 'json'
        parameters: never
        response: { success: boolean; categories: Array<{ id: string; name: string; slug: string }> }
    }
    export type get__category_Slug = {
        method: 'GET'
        path: '/category/{slug}'
        requestFormat: 'json'
        parameters: {
            path: { slug: string }
        }
        response: { success: boolean; category: { id: string; name: string; slug: string } }
    }
    export type get__tag_all = {
        method: 'GET'
        path: '/tag/all'
        requestFormat: 'json'
        parameters: never
        response: { success: boolean; tags: Array<{ id: string; name: string; slug: string; color: string | null }> }
    }
    export type get__user_savedAssets = {
        method: 'GET'
        path: '/user/saved-assets'
        requestFormat: 'json'
        parameters: {
            query: Partial<{
                page: string
                limit: string
                search: string
                games: string
                categories: string
                tags: string
                sortBy: 'savedAt' | 'viewCount' | 'downloadCount' | 'uploadDate' | 'name'
                sortOrder: 'asc' | 'desc'
            }>
        }
        response: {
            success: boolean
            savedAssets: Array<{
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
                tags: Array<{ id: string; name: string; slug: string; color: string | null }>
                uploadedBy: { id: string; username: string | null; image: string | null }
            }>
            pagination: {
                page: number
                limit: number
                total: number
                totalPages: number
                hasNext: boolean
                hasPrev: boolean
            }
        }
    }
    export type post__user_savedAssets_Id = {
        method: 'POST'
        path: '/user/saved-assets/{id}'
        requestFormat: 'json'
        parameters: {
            path: { id: string }
        }
        response: {
            success: boolean
            message: string
            savedAsset?: { id: string; assetId: string; savedAt: string } | undefined
        }
    }
    export type delete__user_savedAssets_AssetId = {
        method: 'DELETE'
        path: '/user/saved-assets/{assetId}'
        requestFormat: 'json'
        parameters: {
            path: { assetId: string }
        }
        response: { success: boolean; message: string }
    }
    export type get__user_checkSavedAsset_Id = {
        method: 'GET'
        path: '/user/check-saved-asset/{id}'
        requestFormat: 'json'
        parameters: {
            path: { id: string }
        }
        response: { success: boolean; savedAsset: boolean }
    }
    export type patch__user_updateAttributes = {
        method: 'PATCH'
        path: '/user/update-attributes'
        requestFormat: 'json'
        parameters: {
            body: Partial<{ displayName: string }>
        }
        response: {
            success: boolean
            message: string
            user?:
                | { id: string; name: string; displayName: string | null; email: string; image: string | null }
                | undefined
        }
    }
    export type get__user_downloadHistory = {
        method: 'GET'
        path: '/user/download-history'
        requestFormat: 'json'
        parameters: {
            query: Partial<{ page: string; limit: string }>
        }
        response: {
            success: boolean
            downloadHistory: Array<{
                historyId: string
                downloadedAt: string
                assets: Array<{
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
                    tags: Array<{ id: string; name: string; slug: string; color: string | null }>
                    uploadedBy: { id: string; username: string | null; image: string | null }
                }>
            }>
            pagination: {
                page: number
                limit: number
                total: number
                totalPages: number
                hasNext: boolean
                hasPrev: boolean
            }
        }
    }
    export type post__personal_refreshDiscord = {
        method: 'POST'
        path: '/personal/refresh-discord'
        requestFormat: 'json'
        parameters: never
        response: {
            success: boolean
            message: string
            user?:
                | { id: string; name: string; email: string; image: string | null; username: string | null }
                | undefined
        }
    }

    // </Endpoints>
}

// <EndpointByMethod>
export type EndpointByMethod = {
    get: {
        '/asset/search': Endpoints.get__asset_search
        '/asset/history': Endpoints.get__asset_history
        '/asset/approval-queue': Endpoints.get__asset_approvalQueue
        '/asset/{id}': Endpoints.get__asset_Id
        '/game/all': Endpoints.get__game_all
        '/game/{slug}': Endpoints.get__game_Slug
        '/category/all': Endpoints.get__category_all
        '/category/{slug}': Endpoints.get__category_Slug
        '/tag/all': Endpoints.get__tag_all
        '/user/saved-assets': Endpoints.get__user_savedAssets
        '/user/check-saved-asset/{id}': Endpoints.get__user_checkSavedAsset_Id
        '/user/download-history': Endpoints.get__user_downloadHistory
    }
    post: {
        '/asset/history': Endpoints.post__asset_history
        '/asset/{id}/approve': Endpoints.post__asset_Id_approve
        '/asset/{id}/deny': Endpoints.post__asset_Id_deny
        '/asset/upload': Endpoints.post__asset_upload
        '/user/saved-assets/{id}': Endpoints.post__user_savedAssets_Id
        '/personal/refresh-discord': Endpoints.post__personal_refreshDiscord
    }
    delete: {
        '/user/saved-assets/{assetId}': Endpoints.delete__user_savedAssets_AssetId
    }
    patch: {
        '/user/update-attributes': Endpoints.patch__user_updateAttributes
    }
}

// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod['get']
export type PostEndpoints = EndpointByMethod['post']
export type DeleteEndpoints = EndpointByMethod['delete']
export type PatchEndpoints = EndpointByMethod['patch']
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
    body?: unknown
    query?: Record<string, unknown>
    header?: Record<string, unknown>
    path?: Record<string, unknown>
}

export type MutationMethod = 'post' | 'put' | 'patch' | 'delete'
export type Method = 'get' | 'head' | 'options' | MutationMethod

type RequestFormat = 'json' | 'form-data' | 'form-url' | 'binary' | 'text'

export type DefaultEndpoint = {
    parameters?: EndpointParameters | undefined
    response: unknown
    responseHeaders?: Record<string, unknown>
}

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
    operationId: string
    method: Method
    path: string
    requestFormat: RequestFormat
    parameters?: TConfig['parameters']
    meta: {
        alias: string
        hasParameters: boolean
        areParametersRequired: boolean
    }
    response: TConfig['response']
    responseHeaders?: TConfig['responseHeaders']
}

export type Fetcher = (method: Method, url: string, parameters?: EndpointParameters | undefined) => Promise<Response>

type RequiredKeys<T> = {
    [P in keyof T]-?: undefined extends T[P] ? never : P
}[keyof T]

type MaybeOptionalArg<T> = RequiredKeys<T> extends never ? [config?: T] : [config: T]

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
    baseUrl: string = ''

    constructor(public fetcher: Fetcher) {}

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl
        return this
    }

    parseResponse = async <T>(response: Response): Promise<T> => {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
            return response.json()
        }
        return response.text() as unknown as T
    }

    // <ApiClient.get>
    get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
        path: Path,
        ...params: MaybeOptionalArg<TEndpoint['parameters']>
    ): Promise<TEndpoint['response']> {
        return this.fetcher('get', this.baseUrl + path, params[0]).then(response =>
            this.parseResponse(response),
        ) as Promise<TEndpoint['response']>
    }
    // </ApiClient.get>

    // <ApiClient.post>
    post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
        path: Path,
        ...params: MaybeOptionalArg<TEndpoint['parameters']>
    ): Promise<TEndpoint['response']> {
        return this.fetcher('post', this.baseUrl + path, params[0]).then(response =>
            this.parseResponse(response),
        ) as Promise<TEndpoint['response']>
    }
    // </ApiClient.post>

    // <ApiClient.delete>
    delete<Path extends keyof DeleteEndpoints, TEndpoint extends DeleteEndpoints[Path]>(
        path: Path,
        ...params: MaybeOptionalArg<TEndpoint['parameters']>
    ): Promise<TEndpoint['response']> {
        return this.fetcher('delete', this.baseUrl + path, params[0]).then(response =>
            this.parseResponse(response),
        ) as Promise<TEndpoint['response']>
    }
    // </ApiClient.delete>

    // <ApiClient.patch>
    patch<Path extends keyof PatchEndpoints, TEndpoint extends PatchEndpoints[Path]>(
        path: Path,
        ...params: MaybeOptionalArg<TEndpoint['parameters']>
    ): Promise<TEndpoint['response']> {
        return this.fetcher('patch', this.baseUrl + path, params[0]).then(response =>
            this.parseResponse(response),
        ) as Promise<TEndpoint['response']>
    }
    // </ApiClient.patch>

    // <ApiClient.request>
    /**
     * Generic request method with full type-safety for any endpoint
     */
    request<
        TMethod extends keyof EndpointByMethod,
        TPath extends keyof EndpointByMethod[TMethod],
        TEndpoint extends EndpointByMethod[TMethod][TPath],
    >(
        method: TMethod,
        path: TPath,
        ...params: MaybeOptionalArg<TEndpoint extends { parameters: infer Params } ? Params : never>
    ): Promise<
        Omit<Response, 'json'> & {
            /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
            json: () => Promise<TEndpoint extends { response: infer Res } ? Res : never>
        }
    > {
        return this.fetcher(method, this.baseUrl + (path as string), params[0] as EndpointParameters)
    }
    // </ApiClient.request>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
    return new ApiClient(fetcher).setBaseUrl(baseUrl ?? '')
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
