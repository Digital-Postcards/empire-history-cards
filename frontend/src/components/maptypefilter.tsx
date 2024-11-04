import { FilterItemProps, OptionType } from "types";
import FilterBox from "./filterbox";
import Select from "react-select";

const MapTypeFilter = (props: FilterItemProps) => {
    const options: OptionType[] = [
        { label: "Modern", value: "Modern" },
        { label: "Historic", value: "Historic" },
    ]
    return (
        <FilterBox label="Map type" classes={props?.withVerticalMargin ? "my-2" : ""}>
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
                        primary25: 'lightgrey',
                        primary: 'black',
                    },
                })}
            />
        </FilterBox>
    )
}

export default MapTypeFilter;