import { HeaderCarousel } from "components/single"
import { ScrollableNavTabs } from "components/single"
import { Outlet } from "react-router-dom"

const BaseSingleLayout = () => {
    return (
        <div>
            <HeaderCarousel />
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
            <div className="relative z-10 pt-[45vh]">
                <ScrollableNavTabs />
                <div className="bg-neutral-200 min-h-screen">
                    {/* each separate page goes here */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default BaseSingleLayout;