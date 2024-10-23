import TagFilter from "components/dashboard/tagfilter";
import MasonryList from "components/dashboard/wiki/MasonryList";
import { FilterIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { WIKI_IMAGES } from "utils";

const WikiList = () => {

    const params = new URLSearchParams(window.location.search)
    const type = params.get("type");

    const [isFilterClicked, setIsFilterClicked] = useState(false);
    const showFilters = (e: any) => {
        e.preventDefault();
        setIsFilterClicked(!isFilterClicked);
    }

    return (
        <>
            <div className="md:col-span-6 col-span-8 p-6">
                <h2 className="text-2xl mb-6 font-bold">{type === "postcard" ? "Postcards" : "Tradecards"}</h2>
                <MasonryList data={WIKI_IMAGES.data} />
            </div>
            <div className="md:hidden block fixed right-5 top-[2%] bg-background p-2 border rounded-lg z-10 cursor-pointer" onClick={showFilters}>
                { !isFilterClicked && <FilterIcon /> }
                { isFilterClicked && <XIcon /> }
            </div>
            <div className={`col-span-2 min-w-[60vw] md:min-w-0 py-6 md:px-2 md:pr-6 md:relative fixed md:right-0 -right-[300px] top-[5%] md:top-0 transition-all duration-300 ${isFilterClicked ? "right-5 drop-shadow-xl" : ""}`}>
                <TagFilter />
            </div>
        </>
    )
}

export default WikiList;