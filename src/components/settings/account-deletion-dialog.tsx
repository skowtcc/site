'use client'

import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Trash2, AlertTriangle, Clock } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

interface AccountDeletionDialogProps {
    onDeleteAccount: () => void
}

export function AccountDeletionDialog({ onDeleteAccount }: AccountDeletionDialogProps) {
    const [confirmationText, setConfirmationText] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(20)
    const [isTimerActive, setIsTimerActive] = useState(false)

    const CONFIRMATION_PHRASE = 'I confirm I want to delete my account'
    const isConfirmationValid = confirmationText === CONFIRMATION_PHRASE
    const isDeleteEnabled = isConfirmationValid && timeRemaining === 0

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isTimerActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsTimerActive(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isTimerActive, timeRemaining])

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setConfirmationText('')
            setTimeRemaining(20)
            setIsTimerActive(true)
        } else {
            setIsTimerActive(false)
        }
    }

    const handleDeleteAccount = () => {
        if (isDeleteEnabled) {
            onDeleteAccount()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <AlertDialog onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2 max-md:mt-2 max-md:w-full">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmation-text">Type "{CONFIRMATION_PHRASE}" to confirm</Label>
                        <Input
                            id="confirmation-text"
                            value={confirmationText}
                            onChange={e => setConfirmationText(e.target.value)}
                            placeholder="I confirm I want to delete my account"
                            className={!isConfirmationValid && confirmationText.length > 0 ? 'border-destructive' : ''}
                        />
                        {!isConfirmationValid && confirmationText.length > 0 && (
                            <p className="text-xs text-destructive">Text must match exactly: "{CONFIRMATION_PHRASE}"</p>
                        )}
                    </div>

                    {isConfirmationValid && timeRemaining > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Please wait {formatTime(timeRemaining)} before proceeding
                            </span>
                        </div>
                    )}

                    {isConfirmationValid && timeRemaining === 0 && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-destructive font-medium">
                                Account deletion is now enabled
                            </span>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsTimerActive(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={!isDeleteEnabled}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
