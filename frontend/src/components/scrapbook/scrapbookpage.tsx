import React from "react";
import { FlipBookPageDataType } from "types";

const ScrapBookPage = React.forwardRef((props: FlipBookPageDataType & { secondImage?: string }, ref: any) => {
    let isEvenPage: boolean = false;
    if (props?.pageNumber) isEvenPage = props?.pageNumber % 2 === 0;

    const leftPageRounded = "rounded-l-md";
    const rightPageRounded = "rounded-r-md";
    return (
        <div
            className={`bg-gradient-to-l from-[#ebdcc6] to-[#e0c9a6] h-full ${isEvenPage ? rightPageRounded : leftPageRounded} p-6`}
            ref={ref}>
            <div className="mt-6">
                <div className="md:block hidden w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                {props.secondImage ? (
                    <div className="flex flex-col gap-4">
                        <img
                            className="mx-auto border-white md:border-[0.5rem] border-2 max-h-[45%] object-contain"
                            src={process.env.REACT_APP_SERVER_URL && process.env.REACT_APP_SERVER_URL + props?.image}
                        />
                        <img
                            className="mx-auto border-white md:border-[0.5rem] border-2 max-h-[45%] object-contain"
                            src={
                                process.env.REACT_APP_SERVER_URL && process.env.REACT_APP_SERVER_URL + props.secondImage
                            }
                        />
                    </div>
                ) : (
                    <img
                        className="mx-auto border-white md:border-[1rem] border-4"
                        src={process.env.REACT_APP_SERVER_URL && process.env.REACT_APP_SERVER_URL + props?.image}
                    />
                )}
                <div className="md:block hidden w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
            </div>
        </div>
    );
});

export default ScrapBookPage;
