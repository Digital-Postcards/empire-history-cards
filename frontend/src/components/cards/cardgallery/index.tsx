import { useApi } from "hooks";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { SingleCard } from "types";
import { InfiniteScrollEnd } from "./infintescrollhelpers";
import { useSearchParams } from "react-router-dom";
import { Error } from "components/error";
import { Loader } from "components/common";

const MasonryList = (props: { filterTags: string[]; type: string | ""; side: string }) => {
    const [noCards, setNoCards] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line @typescript-eslint/no-unused-vars

    const api = useApi(
        "/cards" +
            "?type=" +
            props?.type +
            (props?.filterTags.length > 0 ? "&withTags=" + encodeURIComponent(props?.filterTags.join(",")) : ""),
        { method: "GET" },
    );
    const [cardData, setCardData] = useState<any>([]);

    const getData = async () => {
        const data: any = await api.fetchData();
        if (!data || (data as SingleCard[]).length === 0) {
            if ((data as any).length === 0) {
                setNoCards(true);
            }
        }
        setCardData(data);
    };

    useEffect(() => {
        setCardData([]);
        setSearchParams({ type: props?.type, withTags: encodeURIComponent(props?.filterTags.join(",")) });
        getData();
    }, [props?.filterTags.join(",")]);

    // if side is front, then return the front image, else return the back image
    const getImageLink = (imageLinks: Array<any>) => {
        if (!imageLinks || imageLinks.length === 0) return "";

        // Sort the images based on their filenames (A, B, C, etc.)
        const sortedImages = [...imageLinks].sort((a, b) => {
            const fileA = a.link.split("/").pop() || "";
            const fileB = b.link.split("/").pop() || "";
            return fileA.localeCompare(fileB);
        });

        // Get the appropriate image based on the side
        let imageIndex = 0;
        if (props.side === "back" && sortedImages.length > 1) {
            imageIndex = 1;
        } else if (props.side === "additional" && sortedImages.length > 2) {
            // For additional images, use the third image onwards
            imageIndex = 2;
        }

        return process.env.REACT_APP_SERVER_URL + "/public" + sortedImages[imageIndex].link;
    };

    if (api.isLoading) return <Loader isFullSize={true} />;

    if (cardData === null) {
        return <Error errorType="data-not-found" />;
    }

    if (api.error) return <Error errorType="server-error" />;

    return noCards ? (
        <InfiniteScrollEnd type={props?.type} noCards={true} />
    ) : (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 4 }}>
                <Masonry gutter={"1rem"}>
                    {(cardData as SingleCard[]).map((item: any) => {
                        return (
                            <a key={item._id + "-" + item.name} href={"cards/" + item.item + "/" + item._id}>
                                <div
                                    key={item._id}
                                    className="group h-fit relative cursor-pointer hover:-translate-y-1 hover:shadow-3xl transition-all duration-300">
                                    {item.imageLinks.length > 0 && (
                                        <img className="rounded-lg" src={getImageLink(item.imageLinks)} />
                                    )}
                                    <div className="absolute bottom-0 md:h-48 h-60 w-[100%] p-3 flex-col justify-end text-background rounded-b-lg bg-gradient-to-t from-black to-transparent md:group-hover:flex flex md:hidden">
                                        <p className="md:text-lg text-md font-bold">
                                            {item.item === "postcard" ? "Postcard" : "Tradecard"} #{item.number}
                                        </p>
                                        {item.description && (
                                            <p className="text-sm md:block">
                                                {item.description.slice(0, 60).trim() + "..."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </Masonry>
                <InfiniteScrollEnd type={props?.type} noCards={false} />
            </ResponsiveMasonry>
        </>
    );
};

export default MasonryList;
