import { ReactNode, useEffect, useState, useMemo } from "react";
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

// Helper function to determine if an image is a front image (suffixed with A)
const isFrontImage = (link: string): boolean => {
    // Check if the filename ends with A before the file extension
    return /A\.[^.]+$/.test(link);
};

// Helper function to determine if an image is a back image (suffixed with B)
const isBackImage = (link: string): boolean => {
    // Check if the filename ends with B before the file extension
    return /B\.[^.]+$/.test(link);
};

const CardViewer = (props: CardViewerProps) => {
    // Sort images to ensure front images (A) come before back images (B)
    const sortedImages = useMemo(() => {
        if (!props?.images || props.images.length === 0) {
            return props?.images || [];
        }

        // Create a copy of images to avoid mutating props
        return [...props.images].sort((a, b) => {
            // If one is a front image and the other is a back image
            if (isFrontImage(a.link) && isBackImage(b.link)) {
                return -1; // A comes before B
            }
            if (isBackImage(a.link) && isFrontImage(b.link)) {
                return 1; // B comes after A
            }
            // Otherwise, maintain original order
            return 0;
        });
    }, [props.images]);

    const [currentImageInViewer, setCurrentImageInViewer] = useState<number>(0);
    const [isBlur, setIsBlur] = useState<boolean>(props?.isBlur);
    const [rotate, setRotate] = useState<number>(0);
    const [orientation, setOrientation] = useState<number | null>(sortedImages[currentImageInViewer]?.orientation || 0);

    useEffect(() => {
        setOrientation(sortedImages[currentImageInViewer]?.orientation || 0);
        setRotate(0);
    }, [currentImageInViewer, sortedImages]);

    const nextImage = () => {
        setCurrentImageInViewer((currentImageInViewer + 1) % sortedImages.length);
        setIsBlur(props?.isBlur);
        setRotate(0);
    };

    const previousImage = () => {
        setCurrentImageInViewer((currentImageInViewer - 1 + sortedImages.length) % sortedImages.length);
        setIsBlur(props?.isBlur);
        setRotate(0);
    };

    const handleRotate = async () => {
        const newRotate = rotate + 90;
        setRotate(newRotate % 360);

        const currentImage = sortedImages[currentImageInViewer];

        if (currentImage._id) {
            try {
                const currentOrientation = orientation || 0;
                const newOrientation = (currentOrientation + 90) % 360;

                await updateImageOrientation(currentImage._id, newOrientation);

                setOrientation(newOrientation);
                setRotate(0);

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
                    orientation={orientation}
                    rotate={rotate}
                    isBlur={isBlur}
                    imageURL={sortedImages[currentImageInViewer].link}
                />
            </div>
            <CardViewerToolbar
                orientation={orientation}
                rotate={rotate}
                isBlur={isBlur}
                imageURL={sortedImages[currentImageInViewer].link}
                handleRotate={handleRotate}
                setIsBlur={setIsBlur}
                nextImage={nextImage}
                previousImage={previousImage}
            />
        </div>
    );
};

export default CardViewer;
