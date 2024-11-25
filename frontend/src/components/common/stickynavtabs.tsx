import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MAIN_NAV_LINKS } from "utils";

const StickyNavTabs = () => {
    const location = useLocation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    return (
        <div
            className="
                fixed md:relative md:top-0 top-[8px] left-[8px] md:left-0
                text-neutral-100
                md:w-full w-fit
                flex md:flex-row flex-col justify-center gap-5
                md:px-8 px-6 pt-4 md:pb-0 pb-4
                md:bg-black bg-foreground
                z-50
                md:rounded-none rounded-md
            ">
            {!isMenuOpen && (
                <Menu className="md:hidden block cursor-pointer" onClick={() => setMenuOpen(!isMenuOpen)} />
            )}
            {isMenuOpen && <X className="md:hidden block cursor-pointer" onClick={() => setMenuOpen(!isMenuOpen)} />}
            <div
                className={`md:flex gap-5 ${!isMenuOpen ? "hidden" : "absolute top-[4rem] left-0 left-0 bg-foreground block md:rounded-none rounded-md"} `}>
                {MAIN_NAV_LINKS.map((navLink: { label: string; path: string }) => {
                    return (
                        <div
                            key={navLink.label}
                            className="flex flex-col gap-2 min-w-fit md:m-0 md:py-0 py-3 md:border-none border-neutral-600 border-b md:px-0 px-8">
                            <a href={navLink.path}>{navLink.label}</a>
                            {location.pathname.toLowerCase() === navLink.path && (
                                <div className="h-[7px] w-100 bg-neutral-200 md:block hidden"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StickyNavTabs;
