import { ReactNode } from "react";

const FilterBox = (props: { label: string; children: ReactNode; classes?: string }) => {
    return (
        <div className={`border rounded-xl p-4 bg-background ` + props?.classes}>
            <h3 className="font-bold">{props?.label}</h3>
            {props?.children}
        </div>
    );
};

export default FilterBox;
