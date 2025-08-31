import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from '~/components/ui/timeline'

const items = [
    {
        id: 1,
        date: 'August 30th, 2025',
        title: 'v3.0.1b Quality of Life Improvements',
        description:
            "Big update with lots of improvements! Added character sheets and splash art for Honkai: Nexus Anima, you can now search for specific games, categories, and tags, new content appears much faster on the site, similar assets show up at the bottom of pages to help you find related content, better asset tagging, improved layout and design tweaks, fixed issues with link previews, and the site now remembers your search filters and where you were scrolling so you don't lose your place. We're now working on linking between assets, full audio/video playback, and 3D model viewing.",
    },
    {
        id: 2,
        date: 'August 17th, 2025',
        title: 'v3.0.0b New Infrastructure, Website & Domain',
        description:
            'Complete rebuild of skowt.cc from the ground up! Added user accounts, support for way more asset types, better searching, live asset uploads, and direct contributor uploads. This new foundation makes it much easier to add cool new features.',
    },
    {
        id: 3,
        date: 'May 14th, 2025',
        title: 'v2.3.0a New Quality of Life Features',
        description:
            "Added labels to show fanmade content, ability to save your favorite assets, and a download history so you can track what you've downloaded.",
    },
    {
        id: 4,
        date: 'February 19th, 2025',
        title: 'v2.2.0a View & Multi-Select Modes',
        description:
            'Added special "View" and "Multi-Select" modes to make browsing and selecting multiple assets much easier.',
    },
    {
        id: 5,
        date: 'February 17th, 2025',
        title: 'v2.1.0b Download Fixes',
        description:
            'Fixed issues where downloading lots of assets would sometimes fail, added support for Chrome on iPhone/iPad, and removed the limit on how many assets you can download at once.',
    },
    {
        id: 6,
        date: 'May 29th, 2025',
        title: 'v2.0.0b Site Rebuild',
        description:
            'Rebuilt the entire site with better technology after dealing with a DDoS attack. Everything should run smoother now.',
    },
]

export default function Component() {
    return (
        <Timeline defaultValue={1}>
            {items.map(item => (
                <TimelineItem
                    key={item.id}
                    step={item.id}
                    className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                >
                    <TimelineHeader>
                        <TimelineSeparator />
                        <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                            {item.date}
                        </TimelineDate>
                        <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
                        <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent>{item.description}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}
