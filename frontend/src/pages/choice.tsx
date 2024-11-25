import { ChoiceOfCards, FilterSection } from "components/common";
import MasonryList from "components/cards/cardgallery";
import SubLayoutWithGrid from "layouts/sublayoutwithgrid";
import TagFilter from "components/tagfilter";
import { useState } from "react";

const Cards = () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    const [filterTags, setFilterTags] = useState<string[]>([]);

    if (!type) {
        return (
            <div className="lg:w-2/3 md:w-4/5 w-[92%] mx-auto min-h-screen sm:py-12 py-0 flex justify-center items-center">
                <ChoiceOfCards />
            </div>
        );
    }

    return (
        <SubLayoutWithGrid>
            <div className="md:col-span-6 col-span-8 p-6">
                <h2 className="text-2xl mb-6 font-bold">{type === "postcard" ? "Postcards" : "Tradecards"}</h2>
                <MasonryList filterTags={filterTags} type={type} />
            </div>
            <div className="md:col-span-2 pr-6">
                <FilterSection>
                    <TagFilter setFilterTags={setFilterTags} />
                </FilterSection>
            </div>
        </SubLayoutWithGrid>
    );
};

export default Cards;
