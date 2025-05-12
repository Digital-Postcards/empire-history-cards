import { useEffect, useState } from "react";
import { CardImageInViewerProps } from "types";
import RotatedImage from "../../common/RotatedImage";

const CardImageInViewer = (props: CardImageInViewerProps) => {
    // Determine if image is portrait (90/270 degrees) or landscape (0/180 degrees)
    const isPortraitOrientation = (angle: number) => {
        // Normalize the angle to 0-359 range
        const normalizedAngle = ((angle % 360) + 360) % 360;
        return normalizedAngle === 90 || normalizedAngle === 270;
    };

    // Check if current orientation is portrait or landscape
    const initialOrientation = isPortraitOrientation(props?.orientation || 0);

    // Set initial width based on orientation
    const [imageWidth, setImageWidth] = useState(initialOrientation ? 400 : 700);

    useEffect(() => {
        // Calculate the total rotation by combining stored orientation and temporary rotation
        const totalRotation = (props.rotate || 0) + (props.orientation || 0);

        // Update width based on whether the total rotation results in portrait or landscape orientation
        const isPortrait = isPortraitOrientation(totalRotation);
        setImageWidth(isPortrait ? 400 : 500);
    }, [props.orientation, props.rotate]);

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
