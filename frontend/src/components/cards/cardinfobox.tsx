import InfoSection from "./infosection";
import { CardInfoBoxProps } from "types";
import { Fragment } from "react";

const TagsInInfoBox = (props: { tags: string[] }) => {
    return (
        <>
            {props?.tags?.map((tag: string, index: number) => (
                <Fragment key={index}>
                    <p className="text-primary">{tag}</p>
                    {index !== props?.tags?.length - 1 && <span className="mx-1">{"•"}</span>}
                </Fragment>
            ))}
        </>
    );
};

const CardInfoBox = (props: CardInfoBoxProps) => {
    // Add card type and number at the top if available
    const cardHeader =
        props?.number || props?.item ? (
            <div className="mb-3 text-lg font-bold text-gray-800">
                {props?.item === "postcard" ? "Postcard" : "Trade Card"} #{props?.number}
            </div>
        ) : null;

    return (
        <div className="rounded-lg border border-neutral-300 hover:border-neutral-400 p-6">
            {/* Card basic info */}
            {cardHeader}

            {/* Tags */}
            {props?.tags?.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-3">
                    <TagsInInfoBox tags={props?.tags} />
                </div>
            )}

            {/* Group date and postmark info */}
            <div className="flex flex-wrap gap-2 mb-1">
                {props?.date ? (
                    <InfoSection label="Date">
                        <p>{props?.date}</p>
                    </InfoSection>
                ) : null}
                {props?.postmarked ? (
                    <InfoSection label="Postmarked">
                        <p>{props?.postmarked}</p>
                    </InfoSection>
                ) : null}
            </div>

            {/* Group location and country info */}
            <div className="flex flex-wrap gap-2 mb-1">
                {props?.location ? (
                    <InfoSection label="Location">
                        <p>{props?.location}</p>
                    </InfoSection>
                ) : null}
                {props?.country ? (
                    <InfoSection label="Country">
                        <p>{props?.country}</p>
                    </InfoSection>
                ) : null}
            </div>

            {/* Company Information */}
            {props?.company ? (
                <InfoSection label="Company">
                    <h4 className="text-md font-medium">{props?.company}</h4>
                    {props?.companyInformation ? (
                        <p className="text-sm text-justify mt-1">{props?.companyInformation}</p>
                    ) : (
                        <Fragment />
                    )}
                </InfoSection>
            ) : null}
        </div>
    );
};

export default CardInfoBox;
