import type { Metadata } from 'next'
import './globals.css'
// import { ThemeProvider } from '~/components/theme/theme-provider'
import { SiteHeader } from '~/components/site-header'
import { Footer } from '~/components/nav/footer'
import { ReduxProvider } from '~/lib/redux/provider'
import { Toaster } from '~/components/ui/sonner'

export const metadata: Metadata = {
    title: 'skowt.cc',
    description: "Comprehensive game asset database that's community-driven and free for everyone.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`antialiased`}>
                <ReduxProvider>
                    <div className="[--header-height:calc(--spacing(14))] flex flex-col min-h-screen">
                        <SiteHeader />
                        <div className="flex-1 flex flex-col gap-4">
                            {children}
                            <Footer />
                        </div>
                    </div>
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    )
}
