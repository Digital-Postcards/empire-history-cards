import { useEffect, useState } from "react";
import { CardImageInViewerProps } from "types";

const CardImageInViewer = (props: CardImageInViewerProps) => {
    const [imageWidth, setImageWidth] = useState(props?.orientation === "portrait" ? 400 : 700);
    useEffect(() => {
        setImageWidth(props?.orientation === "portrait" ? 400 : 500)
        if (props?.rotate !== 0)
            setImageWidth(imageWidth === 400 ? 500 : 400);
        console.log(imageWidth)
    }, [props?.orientation, props?.rotate]);

    let computedClasses = "border-white border-[1rem] transition-all duration-300 ease-in ";
    if (props?.isBlur)  computedClasses += "blur-sm";
    if (props?.rotate) {
        if (props.rotate === 90) {
            computedClasses += " rotate-90";
        } else if (props?.rotate === 180) {
            computedClasses += " rotate-180";
        } else if (props?.rotate === 270) {
            computedClasses += " rotate-[270deg]";
        }
    }

    return (
        <img
            height={550}
            width={imageWidth}
            src={props?.imageURL}
            className={computedClasses}
        />
    )
}

export default CardImageInViewer;