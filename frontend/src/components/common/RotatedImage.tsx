import React from "react";

interface RotatedImageProps {
    src: string;
    alt: string;
    orientation?: number | null;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
    objectFit?: React.CSSProperties["objectFit"];
}

const RotatedImage: React.FC<RotatedImageProps> = ({
    src,
    alt,
    orientation = 0,
    width = "auto",
    height = "auto",
    className = "",
    style = {},
    objectFit = "cover",
}) => {
    // Normalize the orientation value
    const normalizedOrientation = orientation || 0;

    // Create a container style with fixed dimensions
    const containerStyle: React.CSSProperties = {
        width,
        height,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
    };

    // Create an image style with rotation only
    const imageStyle: React.CSSProperties = {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit,
        transform: `rotate(${normalizedOrientation}deg)`,
        transition: "transform 0.3s ease",
    };

    return (
        <div style={containerStyle} className={className}>
            <img src={src} alt={alt} style={imageStyle} />
        </div>
    );
};

export default RotatedImage;
