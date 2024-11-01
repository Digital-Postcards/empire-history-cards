import { ArrowRight } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { ChoiceCardProps } from "types";

const ChoiceCard = (props: ChoiceCardProps) => {
    return (
        <div className={`shadow-none lg:p-24 md:p-16 p-8 w-full hover:bg-neutral-100/45 ` + props?.classes}>
            <div className="px-0">
                <h2 className="text-2xl font-bold">{props?.title}</h2>
            </div>
            <div className="px-0 mt-3">
                {props?.children}
            </div>
            <div className="flex lg:flex-row flex-col gap-2 px-0 mt-4">
                <Button size={"lg"} variant={"outline"} onClick={() => window.location.href = "/map?type=" + props?.type}>View on map</Button>
                <Button className="grow px-3" size={"lg"} onClick={() => window.location.href = "/cards?type=" + props?.type}>
                    View all<span className="flex-grow"></span><ArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default ChoiceCard