import { MoveRight } from "lucide-react";
import { GoToExhibitProps } from "types";

const GoToExhibit = (props: GoToExhibitProps) => {
    return (
        <a href={props?.exhibitURL}>
            <div
                className="
                    relative
                    w-96 h-72
                    flex flex-col justify-end
                    text-white
                    rounded-lg
                "
            >
                <img className="rounded-lg absolute h-[100%] w-[100%]" src={props?.imageURL}/>
                <div className="rounded-lg absolute h-[100%] w-[100%] bg-black opacity-55"></div>
                <div className="z-20 py-5 px-6 hover:pr-8 transition-padding duration-100">
                    <h6 className="text-2xl"><code>See it</code></h6>
                    <div className="flex justify-between items-center text-3xl font-bold uppercase">
                        <h6><code>{props?.exhibitTypeMessage}</code></h6>
                        <MoveRight />
                    </div>
                </div>
            </div>
        </a>
    )
}

export default GoToExhibit;