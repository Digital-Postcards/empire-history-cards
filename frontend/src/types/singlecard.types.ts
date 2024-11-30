export type Image = {
    name: string;
    link: string;
    size: {
        height: number;
        width: number;
    };
    orientation: number | null;
    cardNumber: number;
};

interface SingleCard {
    _id: string;
    name: string;
    number: number;
    item: "postcard" | "tradecard";
    place: string;
    company: string;
    date: string;
    companyInformation: string;
    description: string | null;
    analysis: string | null;
    message: string | null;
    imageLinks: Image[];
    themes: string[];
    isBlurByDefault: boolean;
}

export default SingleCard;
