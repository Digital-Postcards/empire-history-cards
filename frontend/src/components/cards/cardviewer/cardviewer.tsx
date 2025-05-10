import { ReactNode, useEffect, useState } from "react";
import CardImageInViewer from "./image";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCw } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { CardViewerProps, CardViewerToolbarProps } from "types";
import { updateImageOrientation } from "../../../services/imageService";

const CardViewerToolbarIcon = (props: { isIconOnly: boolean; onClick?: () => any; children: ReactNode }) => {
    const size: any = props?.isIconOnly ? "icon" : "default";
    return (
        <Button
            variant={"ghost"}
            size={size}
            className={`bg-neutral-700 hover:bg-neutral-600 hover:text-white ${!props?.isIconOnly && "flex gap-2"}`}
            onClick={props?.onClick}>
            {props?.children}
        </Button>
    );
};

const CardViewerToolbar = (props: CardViewerToolbarProps) => {
    return (
        <div className="bg-neutral-800 h-14 w-full px-2 rounded-b-lg flex space-between items-center gap-2 text-white">
            <CardViewerToolbarIcon isIconOnly onClick={props?.handleRotate}>
                <RotateCw size={18} />
            </CardViewerToolbarIcon>
            <CardViewerToolbarIcon isIconOnly={false} onClick={() => props?.setIsBlur(!props?.isBlur)}>
                {props?.isBlur && (
                    <>
                        <Eye size={18} /> Focus
                    </>
                )}
                {!props?.isBlur && (
                    <>
                        <EyeOff size={18} />
                        Blur
                    </>
                )}
            </CardViewerToolbarIcon>
            <div className="grow"></div>
            <CardViewerToolbarIcon isIconOnly onClick={props?.previousImage}>
                <ChevronLeft />
            </CardViewerToolbarIcon>
            <CardViewerToolbarIcon isIconOnly onClick={props?.nextImage}>
                <ChevronRight />
            </CardViewerToolbarIcon>
        </div>
    );
};

const CardViewer = (props: CardViewerProps) => {
    const [currentImageInViewer, setCurrentImageInViewer] = useState<number>(0);
    const [isBlur, setIsBlur] = useState<boolean>(props?.isBlur);
    const [rotate, setRotate] = useState<number>(0);
    const [orientation, setOrientation] = useState<number | null>(props?.images[currentImageInViewer].orientation);

    useEffect(() => {
        setOrientation(props?.images[currentImageInViewer].orientation);
        // Reset rotation to match stored orientation
        setRotate(0);
    }, [currentImageInViewer, props?.images]);

    const nextImage = () => {
        setCurrentImageInViewer((currentImageInViewer + 1) % props?.images.length);
        setIsBlur(props?.isBlur);
        setRotate(0);
    };

    const previousImage = () => {
        setCurrentImageInViewer((currentImageInViewer - 1 + props?.images.length) % props?.images.length);
        setIsBlur(props?.isBlur);
        setRotate(0);
    };

    const handleRotate = async () => {
        const newRotate = (rotate + 90) % 360;
        setRotate(newRotate);

        const currentImage = props?.images[currentImageInViewer];

        // Only persist if the image has an ID
        if (currentImage._id) {
            try {
                // Calculate the new orientation value by adding the rotation to the original orientation
                // The orientation value in the database is the base orientation (1-8 based on EXIF standards)
                // For simplicity, we'll simply use the rotation angle (0, 90, 180, 270)
                // If needed, a more complex calculation can be implemented based on EXIF standards
                const newOrientation = newRotate;

                await updateImageOrientation(currentImage._id, newOrientation);

                // Update the local orientation state
                setOrientation(newOrientation);

                // Update the image data in the props (this is a mutable update but works for immediate UI feedback)
                currentImage.orientation = newOrientation;
            } catch (error) {
                console.error("Failed to update image orientation:", error);
            }
        }
    };

    return (
        <div className="relative flex flex-col w-full h-[66vh] border rounded-lg">
            <div className="h-full bg-neutral-100 flex justify-center items-center overflow-hidden">
                <CardImageInViewer
                    orientation={props?.images[currentImageInViewer].orientation}
                    rotate={rotate}
                    isBlur={isBlur}
                    imageURL={props?.images[currentImageInViewer].link}
                />
            </div>
            <CardViewerToolbar
                orientation={orientation}
                rotate={rotate}
                isBlur={isBlur}
                imageURL={props?.images[currentImageInViewer].link}
                handleRotate={handleRotate}
                setIsBlur={setIsBlur}
                nextImage={nextImage}
                previousImage={previousImage}
            />
        </div>
    );
};

export default CardViewer;
