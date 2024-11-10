import { CircleHelp } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "shadcn/components/ui/hover-card";
import { FlipBookPageDataType } from "types";

const ScrapBookInfo = (props: {currentPageInfoIndex: number, data: FlipBookPageDataType, isDisabled: boolean}) => {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button size={"icon"} variant={"ghost"} disabled={props?.isDisabled} className="w-fit mx-auto cursor-pointer bg-background shadow-lg p-1 rounded-lg">
                    <CircleHelp size={22} />
                </Button>
            </HoverCardTrigger>
            { 
                !props?.isDisabled
                &&
                <HoverCardContent>
                    {props?.data.description}
                </HoverCardContent>
            }
        </HoverCard>
    )
}

export default ScrapBookInfo;