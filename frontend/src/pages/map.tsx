import { useState } from "react";
import TagFilter from "components/tagfilter";
import MapTypeFilter from "components/maptypefilter";
import { FilterSection } from "components/common";
import LeafletMap from "components/map";

const Map = () => {
    return (
        <>
            <LeafletMap />
            {
                // !isLoading &&
                // ------------- MORE WORK TODO -------------
                // <FilterSection isFiltersVisibleInit={true}>
                //     <TagFilter />
                //     <MapTypeFilter withVerticalMargin/>
                // </FilterSection>
            }
        </>
    );
};

export default Map;
