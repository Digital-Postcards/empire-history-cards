import { Dispatch, ReactNode, SetStateAction } from "react";
import { Image } from "./singlecard.types";

interface SingleLayoutProps {
    withCardsHeader: boolean
}

export type MasonryType = {
    item: "postcard" | "tradecard";
    number: number;
    imageLinks: string;
    _id: string;
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

type ScrapBookImage = {
    link: string;
    size: {
        height: number;
        width: number;   
    }
    name: string;
    cardNumber: number;
    orientation: number | null;
}

interface FlipBookPageDataType {
    _id: string;
    pageNumber?: number;
    image: ScrapBookImage;
    description: string;
    themes: string[]
}

interface CardInfoBoxProps {
    tags: string[];
    date: string;
    location: string;
    company: string;
    companyInformation: string;
}

interface CardViewerProps {
    images: Image[],
    isBlur: boolean
}

interface CardImageInViewerProps {
    orientation: number | null;
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

interface FilterItemProps {
    withVerticalMargin?: boolean
}

export type {
    SingleLayoutProps,
    MasonryListProps,
    ChoiceCardProps,
    FlipBookPageDataType,
    CardImageInViewerProps,
    CardViewerToolbarProps,
    FilterItemProps,
    CardInfoBoxProps,
    CardViewerProps
}