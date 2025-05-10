import { useEffect, useState } from "react";
import { CardImageInViewerProps } from "types";
import RotatedImage from "../../common/RotatedImage";

const CardImageInViewer = (props: CardImageInViewerProps) => {
    const [imageWidth, setImageWidth] = useState(props?.orientation === 1 ? 400 : 700);
    useEffect(() => {
        setImageWidth(props?.orientation === 1 ? 400 : 500);
        if (props?.rotate !== 0) setImageWidth(imageWidth === 400 ? 500 : 400);
    }, [props?.orientation, props?.rotate]);

    let computedClasses = "border-white border-[1rem] transition-all duration-300 ease-in ";
    if (props?.isBlur) computedClasses += "blur-sm";

    // Calculate the total rotation by combining stored orientation and temporary rotation
    const totalRotation = (props.rotate || 0) + (props.orientation || 0);

    return (
        <RotatedImage
            src={process.env.REACT_APP_SERVER_URL + "/public" + props?.imageURL}
            alt="Card image"
            orientation={totalRotation}
            width={imageWidth}
            height="auto"
            className={computedClasses}
            objectFit="cover"
        />
    );
};

export default CardImageInViewer;
