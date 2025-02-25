import { ChoiceOfCards, FilterSection } from "components/common";
import MasonryList from "components/cards/cardgallery";
import SubLayoutWithGrid from "layouts/sublayoutwithgrid";
import TagFilter from "components/tagfilter";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";

const Cards = () => {
    const [side, setSide] = useState("front");
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const withTags = params.get("withTags");

    const [filterTags, setFilterTags] = useState<string[]>(withTags ? decodeURIComponent(withTags).split(",") : []);

    if (!type && !withTags) {
        return (
            <div className="lg:w-2/3 md:w-4/5 w-[92%] mx-auto min-h-screen py-24 md:py-12 py-0 flex justify-center items-center">
                <ChoiceOfCards />
            </div>
        );
    }

    const handleFlipSide = () => {
        setSide((prev) => (prev === "front" ? "back" : "front"));
    };

    return (
        <SubLayoutWithGrid>
            <div className="md:col-span-6 col-span-8 p-6">
                {type && (
                    <h2 className="text-2xl mb-6 font-bold">{type === "postcard" ? "Postcards" : "Tradecards"}</h2>
                )}
                {!type && <h2 className="text-2xl mb-6 font-bold">Cards</h2>}
                <MasonryList filterTags={filterTags} type={!type ? "" : type} side={side} />
            </div>
            <div className="md:col-span-2 pr-6">
                <FilterSection>
                    <TagFilter setFilterTags={setFilterTags} />
                    <Button className="grow px-3 mt-3" size={"lg"} variant="default" onClick={handleFlipSide}>
                        FLIP TO {(side === "front" ? "back" : "front").toUpperCase()} SIDE
                    </Button>
                </FilterSection>
            </div>
        </SubLayoutWithGrid>
    );
};

export default Cards;
