import { ActionMeta } from "react-select";
import { FilterItemProps, OptionType } from "types";
import FilterBox from "./filterbox";
import { Dispatch, SetStateAction, useState } from "react";
import Option from "types/tagFilterOption.types";
import { useApi } from "hooks";
import AsyncSelect from "react-select/async";

const TagFilter = (props: { filterOptions?: FilterItemProps; setFilterTags?: Dispatch<SetStateAction<string[]>> }) => {
    const { isLoading, error, fetchData } = useApi("/themes", { method: "GET" });
    const [themes, setThemes] = useState<OptionType[]>([]);

    const formatOptions = (themes: any) => {
        const options: OptionType[] = themes?.map((item: any) => {
            return { label: item.name, value: item.name };
        });
        return options;
    };

    const initSelect = async () => {
        const themes = await fetchData();
        const formattedOptions = formatOptions(themes);
        setThemes(formattedOptions);
        return formattedOptions;
    };

    const onChange = (option: readonly Option[], actionMeta: ActionMeta<Option>) => {
        if (props?.setFilterTags) {
            const valuesArray = option.map((option: Option) => option.value);
            props?.setFilterTags(valuesArray);
        }
    };

    const filterOptionsOnType = async (inputValue: string) => {
        let optionsToFilter;
        if (themes.length > 0) {
            optionsToFilter = themes;
        } else {
            optionsToFilter = await initSelect();
        }
        return optionsToFilter.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const promiseOptions = (inputValue: string) => {
        return new Promise<Option[]>((resolve) => {
            resolve(filterOptionsOnType(inputValue));
        });
    };

    return (
        <FilterBox label="Choose tags" classes={props?.filterOptions?.withVerticalMargin ? "my-2" : ""}>
            {error && <p>Some error happened</p>}
            {!error && (
                <AsyncSelect
                    isMulti
                    cacheOptions={true}
                    defaultOptions
                    name="colors"
                    isLoading={isLoading}
                    className="basic-multi-select mt-2"
                    classNamePrefix="select"
                    loadOptions={promiseOptions}
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
            )}
        </FilterBox>
    );
};

export default TagFilter;
