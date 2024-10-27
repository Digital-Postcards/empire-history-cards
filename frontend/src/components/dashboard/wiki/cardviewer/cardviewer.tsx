import { ReactNode, useEffect, useState } from "react"
import CardImageInViewer from "./image";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCw } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { CardViewerToolbarProps } from "types";

const CardViewerToolbarIcon = (props: {isIconOnly: boolean, onClick?: () => any, children: ReactNode}) => {
    let size: any = props?.isIconOnly ? "icon" : "default";
    return (
        <Button
            variant={"ghost"}
            size={size}
            className={`bg-neutral-700 hover:bg-neutral-600 hover:text-white ${!props?.isIconOnly && "flex gap-2"}`}
            onClick={props?.onClick}
        >
            {props?.children}
        </Button>
    )
}

const CardViewerToolbar = (props: CardViewerToolbarProps) => {
    return (
        <div className="bg-neutral-800 h-14 w-full px-2 rounded-b-lg flex space-between items-center gap-2 text-white">
            <CardViewerToolbarIcon isIconOnly onClick={props?.handleRotate}>
                <RotateCw size={18} />
            </CardViewerToolbarIcon>
            <CardViewerToolbarIcon isIconOnly={false} onClick={() => props?.setIsBlur(!props?.isBlur)}>
                { props?.isBlur && <><Eye size={18}/> Focus</> }
                { !props?.isBlur && <><EyeOff size={18} />Blur</> }
            </CardViewerToolbarIcon>
            <div className="grow"></div>
            <CardViewerToolbarIcon isIconOnly onClick={props?.previousImage}>
                <ChevronLeft />
            </CardViewerToolbarIcon>
            <CardViewerToolbarIcon isIconOnly onClick={props?.nextImage}>
                <ChevronRight />
            </CardViewerToolbarIcon>
        </div>
    )
}

const CardViewer = () => {
    const [images, setImages] = useState<{image: string, orientation: "portrait" | "landscape"}[]>([
        // {image: "/images/wiki/one.jpg", orientation: "portrait"},
        {image: "/images/wiki/three.jpg", orientation: "landscape"},
        {image: "/images/wiki/two.jpg", orientation: "portrait"},
        {image: "/images/wiki/four.jpg", orientation: "portrait"},
    ]);

    const [currentImageInViewer, setCurrentImageInViewer] = useState<number>(0);
    const [isBlur, setIsBlur] = useState<boolean>(true);
    const [rotate, setRotate] = useState<number>(0);
    const [orientation, setOrientation] = useState<"portrait" | "landscape">(images[currentImageInViewer].orientation);

    useEffect(() => {
        setOrientation(images[currentImageInViewer].orientation);
    }, [currentImageInViewer])

    const nextImage = () => {
        setCurrentImageInViewer((currentImageInViewer + 1) % images.length);
        setIsBlur(true);
        setRotate(0);
    }

    const previousImage = () => {
        setCurrentImageInViewer((currentImageInViewer - 1 + images.length) % images.length);
        setIsBlur(true);
        setRotate(0);
    }

    const handleRotate = () => {
        setRotate((rotate + 90) % 360);
    }

    return (
        <div className="relative flex flex-col w-full h-[66vh] border rounded-lg">
            <div className="h-full bg-neutral-100 flex justify-center items-center overflow-hidden">
                <CardImageInViewer
                    orientation={images[currentImageInViewer].orientation}
                    rotate={rotate}
                    isBlur={isBlur}
                    imageURL={images[currentImageInViewer].image}
                />
            </div>
            <CardViewerToolbar
                orientation={orientation}
                rotate={rotate}
                isBlur={isBlur}
                imageURL={images[currentImageInViewer].image}
                handleRotate={handleRotate}
                setIsBlur={setIsBlur}
                nextImage={nextImage}
                previousImage={previousImage}
            />
        </div>
    )
}

export default CardViewer;