import { ReactNode } from "react";

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
    type: "postcard" | "tradecard",
    children: ReactNode | ReactNode[]
}

interface FlipBookPageDataType {
    pageNumber?: number; 
    image: string;
    info: string;
}

export type {
    GoToExhibitProps,
    MasonryListProps,
    ChoiceCardProps,
    FlipBookPageDataType
}