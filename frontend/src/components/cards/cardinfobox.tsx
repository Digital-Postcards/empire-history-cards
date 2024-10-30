import { ReactElement } from "react"
import { DUMMY_TAGS } from "utils"
import InfoSection from "./infosection"


const TagsInInfoBox = (props: {tags: string[]}) => {
    return (
        <>
            {props?.tags.map((tag: string, index: number) => {
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

const CardInfoBox = () => {
    return (
        <div className="rounded-lg border hover:border-neutral-300 p-6">
            <div className="flex items-center flex-wrap gap-2">
                <TagsInInfoBox tags={DUMMY_TAGS} />
            </div>
            <div className="flex gap-2">
                <InfoSection label="Date">
                    <p>werwer</p>
                </InfoSection>
                <InfoSection label="Location">
                    <p>werwer</p>
                </InfoSection>
            </div>
            <InfoSection label="Company">
                <h4 className="text-md">Company name</h4>
                <p className="text-sm">Lorem ipsum odor amet, consectetuer adipiscing elit. Magnis habitant sed nulla tincidunt efficitur rhoncus.</p>
            </InfoSection>
        </div>
    )
}

export default CardInfoBox;