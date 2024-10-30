import Select from "react-select";
import { OptionType } from "types";
import FilterBox from "./filterbox";

const TagFilter = () => {
    const options: OptionType[] = [
        { label: "Tag name 1", value: "Tag name 1" },
        { label: "Tag name 2", value: "Tag name 2" },
        { label: "Tag name 3", value: "Tag name 3" }
    ]
    return (
        <FilterBox label="Choose tags">
            <Select
                defaultValue={[options[2]]}
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select mt-2"
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

export default TagFilter;