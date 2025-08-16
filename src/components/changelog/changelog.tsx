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
        date: 'August 17th, 2025',
        title: 'v3 Site',
        description:
            "3rd site iteration has been released. It's a complete rewrite of the Site & API. Adding new features such as accounts, and support for more asset types and better searching! This site also includes the ability to see recent asset upploads, and allows for contributors to upload assets to the site directly. There is bound to be significant updates to the site over the next couple days as-well.",
    },
    {
        id: 2,
        date: 'May 14th, 2025',
        title: 'New Site Features',
        description: 'Added an indicator for fanmade content, asset saving & a download history feature.',
    },
    {
        id: 3,
        date: 'February 19th, 2025',
        title: 'Dedicated Modes',
        description: "Added a 'View' and 'Multi Select' mode for interacting with assets.",
    },
    {
        id: 4,
        date: 'February 17th, 2025',
        title: 'Mass Downloading Fix',
        description:
            'Mass downloading will no longer occasionally fail, also adding support for Chrome on iOS. The capped liimit for the amouunt of assets you can download has been removed.',
    },
    {
        id: 5,
        date: 'May 29th, 2025',
        title: 'Site Rewrite',
        description: "Frontend was rewritten after a 'failed' DDoS attack from SvelteKit into NextJS.",
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
