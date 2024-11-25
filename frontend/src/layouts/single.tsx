import { HeaderCollage } from "components/single";
import { StickyNavTabs } from "components/common";
import { Outlet, useLocation } from "react-router-dom";
import { SingleLayoutProps } from "types";
import { useEffect, useState } from "react";
import { TriggerWarning } from "components/common";

const BaseSingleLayout = (props: SingleLayoutProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const storeUserPrefInLocalStorage = (checkedState: boolean) => {
        if (checkedState) {
            const now = new Date();
            const item = {
                value: "true",
                expiry: now.getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days
            };
            localStorage.setItem("disablealertfor30days", JSON.stringify(item));
        } else {
            localStorage.removeItem("disablealertfor30days");
        }
    };

    const checkNoTriggerWarningRoutes = () => {
        if (
            location.pathname.startsWith("/history") ||
            location.pathname.startsWith("/ethics-of-representation") ||
            location.pathname.startsWith("/scrapbook") ||
            location.pathname.startsWith("/about")
        ) {
            // double check that the alert is closed
            if (isOpen) setIsOpen(false);
            return true;
        }
        return false;
    };

    const retrieveUserPrefFromLocalStorage = () => {
        // check if the user has opted out of the alert
        const item = localStorage.getItem("disablealertfor30days");
        if (!item) return false;
        const itemObj = JSON.parse(item);
        const now = new Date();
        if (now.getTime() <= itemObj.expiry) return true;
        else return false;
    };

    useEffect(() => {
        if (checkNoTriggerWarningRoutes()) return;
        if (retrieveUserPrefFromLocalStorage()) return;
        else setIsOpen(true);
    }, [location.pathname]);

    return (
        <div>
            <TriggerWarning isOpen={isOpen} setIsOpen={setIsOpen} onCheckedChange={storeUserPrefInLocalStorage} />
            {props?.withCardsHeader && (
                <>
                    <HeaderCollage />
                    <div
                        className="
                            fixed
                            top-0
                            w-screen
                            h-[50vh]
                            bg-gradient-to-b from-transparent to-black
                            opacity-90
                            flex items-end
                        "
                    />
                    <div className="md:w-8/9 w-11/12 fixed md:top-[25%] top-[15%] text-background text-center left-1/2 -translate-x-1/2">
                        <h1 className="md:text-4xl text-3xl font-extrabold">
                            Race, Gender, and the Visual Culture of Domestic Labor
                        </h1>
                        <h3 className="md:text-3xl text-2xl font-light mt-2">
                            Trade-cards and postcards from the 1870s to 1940s
                        </h3>
                    </div>
                </>
            )}
            <div className={`relative z-10 ${props?.withCardsHeader && "pt-[45vh]"}`}>
                <StickyNavTabs />
                <div className="bg-background min-h-screen">
                    {/* each separate page goes here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default BaseSingleLayout;
