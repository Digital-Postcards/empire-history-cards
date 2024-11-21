import { Loader } from "components/common";
import { Error } from "components/error";
import { useApi } from "hooks";
import { useEffect, useState } from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { SingleCard } from "types";

const MasonryList = (props: { filterTags: string[], type: string } ) => {

    const {
        error,
        isLoading, fetchData
    } = useApi("/cards" + "?type=" + props?.type + (props?.filterTags.length > 0 ? "&withTags=" + encodeURIComponent(props?.filterTags.join(",")) : ""), { method: "GET" });
    const [cardData, setCardData] = useState([]);

    const getData = async () => {
        setCardData(await fetchData());
    }

    useEffect(() => {
        getData();
    }, [props?.filterTags])

    if (isLoading)
        return <Loader isFullSize={true} />
    
    if (cardData === null) {
        return <Error errorType="data-not-found" />
    }
    
    if (error)
        return <Error errorType="server-error" />

    return (
        <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}
        >
            <Masonry gutter={"1rem"}>
                {(cardData as SingleCard[]).map((item: any) => {
                    return (
                        <div key={item._id} className="group h-fit relative cursor-pointer hover:-translate-y-1 hover:shadow-3xl transition-all duration-300">
                            {
                                item.imageLinks.length > 0 &&
                                <img
                                    onClick={() => window.location.href = "/cards/" + item.item + "/" + item._id}
                                    className="rounded-lg"
                                    src={process.env.REACT_APP_SERVER_URL + "/public" + item.imageLinks[0].link}
                                />
                            }
                            <div className="absolute bottom-0 md:h-48 h-60 w-[100%] p-3 flex-col justify-end text-background rounded-b-lg bg-gradient-to-t from-black to-transparent md:group-hover:flex flex md:hidden">
                                <p className="md:text-lg text-md font-bold">{item.item === "postcard" ? "Postcard" : "Tradecard"} #{item.number}</p>
                                <p className="text-sm md:block">{item.description.slice(0, 50)}</p>
                            </div>
                        </div>
                    )
                })}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default MasonryList;