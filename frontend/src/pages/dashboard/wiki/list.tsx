import TagFilter from "components/dashboard/tagfilter";

const WikiList = () => {
    return (
        <>
            <div className="col-span-4 p-6">
                Wiki list
            </div>
            <div className="col-span-1 py-6 px-2">
                <TagFilter />
            </div>
        </>
    )
}

export default WikiList;