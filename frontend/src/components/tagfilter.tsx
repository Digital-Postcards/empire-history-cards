import Select, { ActionMeta } from "react-select";
import { FilterItemProps, OptionType } from "types";
import FilterBox from "./filterbox";
import { Dispatch, SetStateAction } from "react";
import Option from "types/tagFilterOption.types";

const TagFilter = (props: {filterOptions?: FilterItemProps, setFilterTags?: Dispatch<SetStateAction<string[]>>}) => {
    const options: OptionType[] = [
        { label: "Tag name 1", value: "tag name 1" },
        { label: "Tag name 2", value: "tag name 2" },
        { label: "Tag name 3", value: "tag name 3" }
    ]

    const onChange = (option: readonly Option[], actionMeta: ActionMeta<Option>) => {
        if (props?.setFilterTags) {
            let valuesArray = option.map((option: Option) => option.value);
            props?.setFilterTags(valuesArray)
        }
    }

    return (
        <FilterBox label="Choose tags" classes={props?.filterOptions?.withVerticalMargin ? "my-2" : ""}>
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
                onChange={onChange}
            />
        </FilterBox>
    )
}

export default TagFilter;