import { HeaderCollage } from "components/single"
import { StickyNavTabs } from "components/common"
import { Outlet } from "react-router-dom"
import { SingleLayoutProps } from "types"
import { useEffect, useState } from "react"
import DialogDemo from "components/common/triggerwarning"

const BaseSingleLayout = (props: SingleLayoutProps) => {

    const [isOpen, setIsOpen] = useState(true)
    useEffect(() => {
        // check if the user has opted out of the alert
        // check if the paths are /ethics-of-representation, /history, /scrapbook, /about and don't display the alert
    }, []);

    return (
        <div>
            <DialogDemo isOpen={isOpen} setIsOpen={setIsOpen}/>
            {
                props?.withCardsHeader &&
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
                        <h1 className="md:text-4xl text-3xl font-extrabold">Race, Gender, and the Visual Culture of Domestic Labor</h1>
                        <h3 className="md:text-3xl text-2xl font-light mt-2">Trade-cards and postcards from the 1870s to 1940s</h3>
                    </div>
                </>
            }
            <div className={`relative z-10 ${props?.withCardsHeader && "pt-[45vh]"}`}>
                <StickyNavTabs />
                <div className="bg-neutral-200 min-h-screen">
                    {/* each separate page goes here */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default BaseSingleLayout;