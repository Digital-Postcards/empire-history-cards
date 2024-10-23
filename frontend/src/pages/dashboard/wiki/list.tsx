import TagFilter from "components/dashboard/tagfilter";
import MasonryList from "components/dashboard/wiki/MasonryList";
import { WIKI_IMAGES } from "utils";

const WikiList = () => {

    const params = new URLSearchParams(window.location.search)
    const type = params.get("type");

    return (
        <>
            <div className="col-span-6 p-6">
                <h2 className="text-2xl mb-6 font-bold">{type === "postcard" ? "Postcards" : "Tradecards"}</h2>
                <MasonryList data={WIKI_IMAGES.data} />
            </div>
            <div className="col-span-2 py-6 px-2 pr-6">
                <TagFilter />
            </div>
        </>
    )
}

export default WikiList;