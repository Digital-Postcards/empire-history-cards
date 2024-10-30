import { CAROUSEL_IMAGE_URLS } from "utils";

const HeaderCollage = () => {
    return (
        <div className="w-screen fixed top-0 h-[100%] grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-2 overflow-hidden">
            {CAROUSEL_IMAGE_URLS.map((url: string) => {
                return (
                    <div style={{ background: `url(${url})`, backgroundPosition: "center", backgroundSize: "cover" }} className="h-100 w-100"></div>
                )
            })}
        </div>
    )
}

export default HeaderCollage;