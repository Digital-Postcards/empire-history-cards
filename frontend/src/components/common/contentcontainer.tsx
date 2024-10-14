import { ReactNode } from "react";

const ContentContainer = (props: {
    children: ReactNode
}) => {
    return (
        <div className={
            `md:w-2/3 md:p-2 p-12 md:pt-12 mx-auto`
        }>
            {props?.children}
        </div>
    )
}

export default ContentContainer;