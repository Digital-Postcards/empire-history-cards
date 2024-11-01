import { Dispatch, ReactNode, SetStateAction } from "react";

interface SingleLayoutProps {
    withCardsHeader: boolean
}

type MasonryType = {
    type: "postcard" | "tradecard";
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
    classes?: string 
}

interface FlipBookPageDataType {
    pageNumber?: number; 
    image: string;
    info: string;
}

interface CardImageInViewerProps {
    orientation: "portrait" | "landscape";
    rotate: number;
    isBlur: boolean;
    imageURL: string
}

interface CardViewerToolbarProps extends CardImageInViewerProps {
    handleRotate: () => any;
    setIsBlur: Dispatch<SetStateAction<boolean>>;
    nextImage: () => any;
    previousImage: () => any;

}

export type {
    SingleLayoutProps,
    MasonryListProps,
    ChoiceCardProps,
    FlipBookPageDataType,
    CardImageInViewerProps,
    CardViewerToolbarProps
}