"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";
import { AssetDownloadIndicator } from "../asset/download-indicator";
import { CommandSearch } from "./command";
import { Button } from "../ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export default function NavBar() {
    return (
        <header className="top-0 bg-background/90 backdrop-blur-sm border-b sticky z-50">
            <div className="p-2 text-xs bg-destructive hover:bg-destructive/90 justify-center text-center text-primary group flex gap-1 items-center transition-all duration-150 ease-linear">
                wanderer.moe will be undergoing maintenance for a major update
                between Aug 16-17 for around 10 hours. Join the Discord for more
                information & for assets missing from the site.
            </div>
            <nav className="flex justify-between tems-center max-w-screen-xl px-5 py-2 mx-auto">
                <Link href="/" className="text-lg font-semibold">
                    <div className="flex flex-row gap-1 items-center">
                        <img
                            src="/logo.png"
                            alt="wanderer.moe"
                            className="translate-y-[2px]"
                            width={32}
                            height={32}
                        />
                    </div>
                </Link>
                <div className="flex flex-row gap-2 items-center">
                    <AssetDownloadIndicator />
                    <CommandSearch />
                    <Link
                        href="https://discord.gg/noid"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline">
                            <DiscordLogoIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
