import { ReactNode } from "react";

const SubLayoutWithGrid = (props: { children: ReactNode }) => {
    return (
        <div className="grid grid-cols-8">{props?.children}</div>
    )
}

export default SubLayoutWithGrid;