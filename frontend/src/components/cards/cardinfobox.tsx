import InfoSection from "./infosection"
import { CardInfoBoxProps } from "types"

const TagsInInfoBox = (props: {tags: string[]}) => {
    return (
        <>
            {props?.tags.map((tag: any, index: number) => {
                return (
                    <>
                        <p>{tag}</p>
                        { index !== props?.tags.length - 1 && <span>{"🞄"}</span> }
                    </>
                )
            })}
        </>
    )
}

const CardInfoBox = (props: CardInfoBoxProps) => {
    return (
        <div className="rounded-lg border border-neutral-300 hover:border-neutral-400 p-6">
            <div className="flex items-center flex-wrap gap-2">
                <TagsInInfoBox tags={props?.tags} />
            </div>
            <div className="flex gap-2">
                <InfoSection label="Date">
                    <p>{props?.date}</p>
                </InfoSection>
                {
                    props?.location &&
                    <InfoSection label="Location">
                        <p>{props?.location}</p>
                    </InfoSection>
                }
            </div>
            {
                props?.company &&
                <>
                    <InfoSection label="Company">
                        <h4 className="text-md">{props?.company}</h4>
                        <p className="text-sm">{props?.companyInformation}</p>
                    </InfoSection>
                </>
            }
        </div>
    )
}

export default CardInfoBox;