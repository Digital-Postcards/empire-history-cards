import { useEffect } from "react";
import { CardImageInViewerProps } from "types";

const CardImageInViewer = (props: CardImageInViewerProps) => {
    useEffect(() => {
        // empty dependency array means this effect runs once on mount
    }, []);

    return (
        <div className="card-image-parent overflow-hidden aspect-[1.1/1] rounded-t-lg bg-white">
            <div
                className={`w-full h-full flex transition-all justify-center p-3 ${props?.orientation === 2 ? "rotate-180" : ""}`}
                style={{ transform: `rotate(${props?.rotate}deg)` }}>
                <img
                    src={props?.imageURL}
                    className={`${props?.isBlur ? "blur-sm" : ""} object-contain transition-all ease-in-out duration-300`}
                    alt="Card"
                />
            </div>
        </div>
    );
};

export default CardImageInViewer;
