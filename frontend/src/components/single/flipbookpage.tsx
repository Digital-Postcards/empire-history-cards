import React from "react";
import { FlipBookPageDataType } from "types";  

const FlipBookPage = React.forwardRef((props: FlipBookPageDataType, ref: any) => {

    let isEvenPage: boolean = false;
    if (props?.pageNumber)
        isEvenPage = (props?.pageNumber % 2) === 0;

    let leftPageRounded = "rounded-l-md";
    let rightPageRounded = "rounded-r-md";

    return (
        <div className={`bg-gradient-to-l from-[#ebdcc6] to-[#e0c9a6] h-full ${isEvenPage ? rightPageRounded : leftPageRounded} p-6`} ref={ref}>
            <div className="mt-6">
                <div className="w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                <img className="mx-auto h-[680px] border-white border-[1rem]" src={props?.image} />
                <div className="w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
            </div>
        </div>
    )
})

export default FlipBookPage;