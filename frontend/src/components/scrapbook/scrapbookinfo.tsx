import { CircleHelp } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "shadcn/components/ui/hover-card";
import { FlipBookPageDataType } from "types";

const ScrapBookInfo = (props: { currentPageInfoIndex: number; data: FlipBookPageDataType; isDisabled: boolean }) => {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button
                    size={"icon"}
                    variant={"ghost"}
                    disabled={props?.isDisabled}
                    className="w-fit mx-auto cursor-pointer bg-background shadow-lg p-1 rounded-lg">
                    <CircleHelp size={22} />
                </Button>
            </HoverCardTrigger>
            {!props?.isDisabled && (
                <HoverCardContent>
                    <div className="flex flex-wrap gap-x-2">
                        {props?.data.themes.map((tag: any, index: number) => {
                            return (
                                <>
                                    <p className="text-sm text-neutral-500">{tag}</p>
                                    {index !== props?.data.themes.length - 1 && <span>{"🞄"}</span>}
                                </>
                            );
                        })}
                    </div>
                    <p className="mt-4">{props?.data.description}</p>
                    <a href={"/cards/" + props?.data.item + "/" + props?.data._id}>
                        <Button className="mt-2">See more...</Button>
                    </a>
                </HoverCardContent>
            )}
        </HoverCard>
    );
};

export default ScrapBookInfo;
