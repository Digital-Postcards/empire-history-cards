import { CAROUSEL_IMAGE_URLS } from "utils";

const HeaderCarousel = () => {
    return (
        <div className="cards-carousel fixed top-0 w-screen h-[50vh] overflow-hidden pl-0 m-0">
            {CAROUSEL_IMAGE_URLS.map((url: string) => {
                return <img src={url} />
            })}
        </div>
    )
}

export default HeaderCarousel;