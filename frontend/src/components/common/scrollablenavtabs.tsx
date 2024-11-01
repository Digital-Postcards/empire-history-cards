import { useLocation } from "react-router-dom";
import { MAIN_NAV_LINKS } from "utils";

const ScrollableNavTabs = () => {
    const location = useLocation();
    return (
        <div className="sticky top-0 text-neutral-100 flex justify-center gap-5 overflow-scroll px-8 pt-4 bg-black z-50">
            {
                MAIN_NAV_LINKS.map((navLink: { label: string, path: string }) => {
                    return (
                        <div className="flex flex-col gap-2 min-w-fit">
                            <a href={navLink.path}>
                                {navLink.label}
                            </a>
                            {location.pathname.toLowerCase() === navLink.path && <div className="h-[7px] w-100 bg-neutral-200"></div>}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ScrollableNavTabs;