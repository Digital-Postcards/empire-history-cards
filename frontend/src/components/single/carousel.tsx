import { useState, useEffect } from "react";
import { CAROUSEL_IMAGE_URLS } from "utils";

const HeaderCollage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGE_URLS.length);
    };

    // Autoplay effect
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [currentIndex]); // Re-run effect when currentIndex changes

    return (
        <div className="w-screen fixed top-0 h-screen overflow-hidden">
            {/* Carousel Container */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {CAROUSEL_IMAGE_URLS.map((url: string) => (
                    <div
                        key={url}
                        style={{
                            background: `url(${url})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                        className="w-screen h-screen flex-shrink-0"></div>
                ))}
            </div>
        </div>
    );
};

export default HeaderCollage;
