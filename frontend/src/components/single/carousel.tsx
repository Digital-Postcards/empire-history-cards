import { useState, useEffect } from "react";

// Dynamically import images using Webpack's `require.context` method
const images = require.context("/public/images/carousel", false, /\.(jpg|jpeg|png|gif)$/);

const imagePaths = images.keys();

const HeaderCollage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-screen fixed top-0 h-screen overflow-hidden bg-light-gray">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {imagePaths.map((image, index) => (
                    <div key={index} className="w-screen h-[45vh] flex-shrink-0 bg-white flex justify-center">
                        <img
                            src={images(image)}
                            alt={`Slide ${index}`}
                            className="object-contain max-h-full"
                            style={{ alignSelf: "flex-start" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeaderCollage;
