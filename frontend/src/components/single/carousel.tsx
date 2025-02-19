import { useState, useEffect } from "react";

// Dynamically import images using Webpack's `require.context` method
const images = require.context("/public/images/carousel", false, /\.(jpg|jpeg|png|gif)$/);

const imagePaths = images.keys(); // Get all the file paths of the images

const HeaderCollage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handle the transition to the next slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    };

    // Set an interval to change the slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    return (
        <div className="w-screen fixed top-0 h-screen overflow-hidden">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {imagePaths.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            background: `url(${images(image)}) center/cover no-repeat`,
                        }}
                        className="w-screen h-[45vh] flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default HeaderCollage;
