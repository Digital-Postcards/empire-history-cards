import { useState } from "react";
import TagFilter from "components/tagfilter";
import MapTypeFilter from "components/maptypefilter";
import { Loader } from "components/common";
import MapViewer from "components/map";

const Map = () => {

    const [isLoading, setLoading] = useState(true);

    return (
        <>
            <MapViewer setLoading={setLoading} />
            { isLoading && <Loader isFullSize={true} classes="fixed top-0" /> }
            {
                !isLoading &&
                <div className="fixed flex flex-col gap-3 right-0 h-full w-1/5 p-4">
                    <TagFilter />
                    <MapTypeFilter />
                </div>
            }
        </>

    )
}

export default Map;