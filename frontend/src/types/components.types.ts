import { Dispatch, ReactNode, SetStateAction } from "react";

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
    GoToExhibitProps,
    MasonryListProps,
    ChoiceCardProps,
    FlipBookPageDataType,
    CardImageInViewerProps,
    CardViewerToolbarProps
}