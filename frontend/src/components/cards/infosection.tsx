import { ReactElement } from "react";

const InfoSection = (props: { label: string; children: ReactElement | ReactElement[] }) => {
    return (
        <div className="text-neutral-500">
            <h3 className="text-lg mt-3 text-primary font-bold">{props?.label}</h3>
            {props?.children}
        </div>
    );
};

export default InfoSection;
