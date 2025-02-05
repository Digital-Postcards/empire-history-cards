import { ReactNode } from "react";

const ContentContainer = (props: { children: ReactNode }) => {
    return <div className={`md:w-9/12 md:p-2 p-12 md:pt-24 mx-auto content`}>{props?.children}</div>;
};

export default ContentContainer;
