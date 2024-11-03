import { useState } from "react";
import TagFilter from "components/tagfilter";
import MapTypeFilter from "components/maptypefilter";
import { FilterSection, Loader } from "components/common";
import MapViewer from "components/map";

const Map = () => {

    const [isLoading, setLoading] = useState(true);

    return (
        <>
            <MapViewer setLoading={setLoading} />
            { isLoading && <Loader isFullSize={true} classes="fixed top-0" /> }
            {
                // !isLoading &&
                // ------------- MORE WORK TODO -------------
                // <FilterSection isFiltersVisibleInit={true}>
                //     <TagFilter />
                //     <MapTypeFilter withVerticalMargin/>
                // </FilterSection>
            }
        </>

    )
}

export default Map;