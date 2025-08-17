import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
    baseURL: 'https://den.skowt.cc',
    disabledPaths: ["/update-user"],
    basePath: "/auth",
    plugins: [
        inferAdditionalFields({
            user: {
                displayName: { type: 'string', required: false },
                role: { type: 'string', required: false },
            },
        }),
    ],
})
