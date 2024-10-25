import { CircleHelp } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "shadcn/components/ui/hover-card";
import { FLIPBOOK_PAGE_DATA } from "utils";

const FlipBookInfo = (props: {currentPageInfoIndex: number}) => {
    const isDisabled: boolean = props?.currentPageInfoIndex === FLIPBOOK_PAGE_DATA.length;
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button size={"icon"} variant={"ghost"} disabled={isDisabled} className="w-fit mx-auto cursor-pointer bg-background shadow-lg p-1 rounded-lg">
                    <CircleHelp size={22} />
                </Button>
            </HoverCardTrigger>
            { 
                !isDisabled
                &&
                <HoverCardContent>
                    {FLIPBOOK_PAGE_DATA[props?.currentPageInfoIndex].info}
                </HoverCardContent>
            }
        </HoverCard>
    )
}

export default FlipBookInfo;