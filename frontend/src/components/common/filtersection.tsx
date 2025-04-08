import { Filter, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "shadcn/components/ui/button";

const FilterSection = (props: { isFiltersVisibleInit?: boolean; children: ReactNode }) => {
    const [isFiltersVisible, setFiltersVisible] = useState(props?.isFiltersVisibleInit);
    return (
        <div className="md:p-4 py-[8px] px-2 md:sticky fixed top-0 right-0 md:w-full w-2/3 z-50">
            <Button
                size={"icon"}
                className="md:hidden hidden w-16 h-14 float-right flex md:w-0 md:h-0"
                onClick={() => {
                    setFiltersVisible(!isFiltersVisible);
                }}>
                {!isFiltersVisible && <Filter size={24} />}
                {isFiltersVisible && <X size={24} />}
            </Button>
            <div
                className={`w-full px-2 mt-16 md:relative absolute transition-all duration-200 ${isFiltersVisible ? "right-0" : "-right-[50rem]"} md:right-auto`}>
                {props?.children}
            </div>
        </div>
    );
};

export default FilterSection;
