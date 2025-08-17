'use client'

import { ChevronsUpDown, LogOut, Settings2Icon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth/auth-client'

export function NavUser() {
    const router = useRouter()

    const { data: session, error, isPending } = authClient.useSession()

    if (isPending || (!isPending && !session?.user) || error || !session) {
        return (
            <div className="bg-background p-3">
                <div className="flex flex-col gap-2">
  <Button
      variant="default"
      size="sm"
      className="w-full"
      onClick={async () => {
          await authClient.signIn.social({
              provider: 'discord',
              callbackURL: 'https://skowt.cc', 
          })
      }}
  >
      Login With Discord
  </Button>
                </div>
            </div>
        )
    }

    const user = session.user
    const username = user.name || 'Unknown User'
    const displayName = user.displayName
    
    const displayText = displayName ? `${displayName} (@${username})` : username
    
    const fallbackLetter = (displayName || username).charAt(0).toUpperCase()

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = '/'
                    },
                },
            })
            router.push('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className="bg-background">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start h-auto p-3 data-[state=open]:bg-muted">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.image || ''} alt={displayText} />
                            <AvatarFallback className="rounded-lg">{fallbackLetter}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                            <span className="truncate font-medium">{displayText}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="top"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 mb-1 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.image || ''} alt={displayText} />
                                <AvatarFallback className="rounded-lg">{fallbackLetter}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{displayText}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push('/settings')}>
                            <Settings2Icon />
                            Settings
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
