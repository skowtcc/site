import { createApiClient, Method, EndpointParameters } from './schema/api.zod'

const devUrl = 'http://localhost:8787'

export const client = createApiClient(
    async (method: Method, url: string, parameters: EndpointParameters | undefined) => {
        let requestUrl = url
        let body: string | undefined

        if (parameters) {
            // Handle path parameter substitution for all methods
            if (parameters.path) {
                Object.entries(parameters.path).forEach(([key, value]) => {
                    requestUrl = requestUrl.replace(`{${key}}`, String(value))
                })
            }

            if (method === 'get') {
                // For GET requests, only handle query parameters in URL
                if (parameters.query) {
                    const searchParams = new URLSearchParams()
                    Object.entries(parameters.query).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            searchParams.append(key, String(value))
                        }
                    })
                    const queryString = searchParams.toString()
                    if (queryString) {
                        requestUrl += (requestUrl.includes('?') ? '&' : '?') + queryString
                    }
                }
                // Don't send any body for GET requests
            } else {
                // For other methods, extract the body parameter specifically
                if (parameters.body) {
                    body = JSON.stringify(parameters.body)
                } else {
                    // If no body parameter, send all non-path/query parameters
                    const bodyParams = { ...parameters }
                    delete bodyParams.path
                    delete bodyParams.query
                    if (Object.keys(bodyParams).length > 0) {
                        body = JSON.stringify(bodyParams)
                    }
                }
            }
        }

        const headers: HeadersInit = {}
        
        // Always set Content-Type for non-GET requests with body
        if (body && method !== 'get') {
            headers['Content-Type'] = 'application/json'
        }

        const response = await fetch(requestUrl, {
            method: method.toUpperCase(), // Ensure method is uppercase
            ...(body && { body }),
            headers,
            credentials: 'include',
        })

        return response
    },
    devUrl,
)
