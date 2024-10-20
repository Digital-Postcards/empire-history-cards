interface GoToExhibitProps {
    imageURL: string;
    exhibitTypeMessage: string;
    exhibitURL: string;
}

type MasonryType = {
    image: string;
    cardURL: string;
}

interface MasonryListProps {
    data: MasonryType[]
}

interface ChoiceCardProps {
    title: string;
    image: string;
    description: string;
    type: "postcard" | "tradecard"
}

export type {
    GoToExhibitProps,
    MasonryListProps,
    ChoiceCardProps
}