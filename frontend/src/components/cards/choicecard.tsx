import { ArrowRight } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { ChoiceCardProps } from "types";

const ChoiceCard = (props: ChoiceCardProps) => {
    return (
        <div className="border-none shadow-none md:p-24 p-8 w-full hover:bg-neutral-100/25">
            <div className="px-0">
                <h2 className="text-2xl font-bold">{props?.title}</h2>
            </div>
            <div className="px-0 mt-3">
                {props?.children}
            </div>
            <div className="flex gap-2 px-0 mt-4">
                <Button size={"lg"} variant={"outline"} onClick={() => window.location.href = "/exhibit/map?type=" + props?.type}>View on map</Button>
                <Button className="grow px-3" size={"lg"} onClick={() => window.location.href = "/exhibit/wiki/list?type=" + props?.type}>
                    View all<span className="flex-grow"></span><ArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default ChoiceCard