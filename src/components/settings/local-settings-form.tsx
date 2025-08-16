'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'

const LOCAL_STORAGE_KEY = 'showSuggestiveContent'

export function LocalSettingsForm() {
    const [showSuggestive, setShowSuggestive] = useState(false)
    const [isGBUser, setIsGBUser] = useState<boolean>(true)

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored !== null) {
            setShowSuggestive(stored === 'true')
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, String(showSuggestive))
    }, [showSuggestive])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Local Settings</CardTitle>
                <CardDescription>
                    These settings are stored locally in your browser and do not require an account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isGBUser ? (
                    <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg flex flex-col gap-2 text-sm text-destructive">
                        <p>
                            You're visiting skowt.cc from the UK. Normally, a switch would be here to allow you to view
                            NSFW/Suggestive content.
                        </p>
                        <p>
                            However, UK law enforced by Ofcom means skowt.cc is legally required to block access to
                            NSFW/Suggestive content. The only legal way to skowt.cc would be able to show UK users this
                            NSFW/Suggestive content would be to ask for your ID, and we will never implement ID
                            verification.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-suggestive">Show Suggestive/NSFW Content</Label>
                        <Switch
                            id="show-suggestive"
                            disabled={isGBUser}
                            checked={showSuggestive}
                            onCheckedChange={setShowSuggestive}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
