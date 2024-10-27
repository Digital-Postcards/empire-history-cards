import { ArrowLeft, BookMarked, ChevronsLeft, ChevronsRight, MapIcon, Waypoints } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "shadcn/components/ui/button";
import { NavLinkType } from "types";
import { SIDEBAR_NAV_LINKS } from "utils/constants";

interface CollapsibleSideBarProps {
    collapseSidebar: Dispatch<SetStateAction<boolean>>;
    isCollapseSidebar: boolean
}

const navLinkToIconMap: any = {
    "mapicon": <MapIcon size={"20"} />,
    "wikiicon": <BookMarked size={"20"} />,
    "tagsicon": <Waypoints size={"20"} />,
    "homeicon": <ArrowLeft size={"20"} />
}

const CollapsibleSideBar = (props: CollapsibleSideBarProps) => {
    const location = useLocation();
    const currentPath: string = location.pathname;
    return (
        <div className="border-r-[1px] flex flex-col justify-between p-3">
            <div>
                <h3 className="text-lg mb-4">
                    {/* <code>{props?.isCollapseSidebar ? "EMPIRE HISTORY CARDS EXHIBIT" : "Ex."}</code> */}
                </h3>
                {SIDEBAR_NAV_LINKS.map((navLink: NavLinkType) => {
                    return (
                        <a href={navLink.path}>
                            <Button
                                variant={"ghost"}
                                size={!props?.isCollapseSidebar ? "icon" : "default"}
                                className={`
                                    w-full py-5 mt-2 ${props?.isCollapseSidebar && "flex items-center justify-start gap-3"}
                                    ${currentPath === navLink.path && "bg-primary text-background"}
                                `}
                            >
                                {navLinkToIconMap[`${navLink.icon}`]}
                                {props?.isCollapseSidebar && navLink.label}
                            </Button>
                        </a>
                    )
                })}
            </div>
            <Button
                onClick={() => props?.collapseSidebar(!props?.isCollapseSidebar)}
                variant={"outline"}
                size={"icon"}
                className="text-neutral-400 self-end md:block hidden"
            >
                {props?.isCollapseSidebar && <><ChevronsLeft className="h-5 w-5" /></>}
                {!props?.isCollapseSidebar && <ChevronsRight className="h-5 w-5" />}
            </Button>
        </div>
    )
}

export default CollapsibleSideBar;