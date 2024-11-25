import { FilterItemProps, OptionType } from "types";
import FilterBox from "./filterbox";
import Select from "react-select";
import Option from "types/tagFilterOption.types";
import { Dispatch, SetStateAction } from "react";

const MapTypeFilter = (props: {
    filterOptions?: FilterItemProps;
    setMapType: Dispatch<SetStateAction<string | undefined>>;
}) => {
    const options: OptionType[] = [
        { label: "Historic", value: "Historic" },
        { label: "Modern", value: "Modern" },
    ];

    const onChange = (option: Option | null) => {
        if (props?.setMapType) props?.setMapType(option?.value.toLowerCase());
    };

    return (
        <FilterBox label="Map type" classes={props?.filterOptions?.withVerticalMargin ? "my-2" : ""}>
            <Select
                defaultValue={options[0]}
                name="maps"
                options={options}
                className="basic-single mt-2"
                classNamePrefix="select"
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                        ...theme.colors,
                        primary25: "lightgrey",
                        primary: "black",
                    },
                })}
                onChange={onChange}
            />
        </FilterBox>
    );
};

export default MapTypeFilter;
