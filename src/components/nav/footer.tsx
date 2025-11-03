import Link from 'next/link'

export function Footer() {
    return (
        <div className="p-6 pb-0">
            <div className="flex flex-col gap-4 p-4 mb-6 w-full bg-card border rounded-xl border-border">
                <p className="text-sm text-muted-foreground text-center">
                    &copy; 2022-2025 skowt.cc, built with ❤️ by{' '}
                    <Link
                        href="https://dromzeh.dev/"
                        className="text-foreground hover:text-muted transition-colors duration-150"
                    >
                        dromzeh
                    </Link>
                </p>
                <p className="text-xs text-muted-foreground text-center">
                    skowt.cc is a free to use service provided by Originoid LTD. Company no. 15988228. ICO Registration
                    no. ZB857511.
                    <br />
                    Not affiliated with any of the games or companies listed on this site unless otherwise stated.
                    <br />
                    Please send takedown requests to marcel [at] originoid [dot] co
                </p>
            </div>
        </div>
    )
}
