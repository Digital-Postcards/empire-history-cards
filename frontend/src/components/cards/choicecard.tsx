import { ArrowRight } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { ChoiceCardProps } from "types";

const ChoiceCard = (props: ChoiceCardProps) => {
    return (
        <div
            style={{
                background: "url(" + props?.image + ")",
                backgroundRepeat: "none",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
            }}
            className={`relative lg:p-24 md:p-16 p-8 w-full ` + props?.classes}>
            <div className="z-10 relative peer">
                <div className="px-0 text-white">
                    <h2 className="text-2xl font-bold">{props?.title}</h2>
                </div>
                <div className="px-0 mt-3 text-white">{props?.children}</div>
                <div className="flex lg:flex-row flex-col gap-2 px-0 mt-4">
                    <Button
                        size={"lg"}
                        variant={"outline"}
                        onClick={() => (window.location.href = "/map?type=" + props?.type)}>
                        View on map
                    </Button>
                    <Button
                        className="grow px-3"
                        size={"lg"}
                        onClick={() => (window.location.href = "/cards?type=" + props?.type)}>
                        View all<span className="flex-grow"></span>
                        <ArrowRight />
                    </Button>
                </div>
            </div>
            <div
                className="
                            absolute h-full w-full left-0 top-0 
                            bg-black/50 hover:bg-neutral-900/65 peer-hover:bg-neutral-900/65
                            backdrop-blur-sm peer-hover:backdrop-blur-md hover:backdrop-blur-md 
                            transition-all duration-200
                            z-0
                        "></div>
        </div>
    );
};

export default ChoiceCard;
