import { ContentContainer } from "components/common"
import HTMLFlipBook from "react-pageflip";
import { FlipBookPageDataType } from "types";
import { FLIPBOOK_PAGE_DATA } from "utils";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { ScrapBookInfo, ScrapBookPage } from "components/scrapbook";

const Scrapbook = () => {

    const [currentPageInfoIndex, setCurrentPageInfoIndex] = useState<number>(0);
    const ref = useRef();

    const handlePageFlip = () => {
        {/* @ts-ignore */}
        setCurrentPageInfoIndex(ref?.current.pageFlip().getCurrentPageIndex());
    }

    const gotoNext = () => {
        if(ref.current)
            {/* @ts-ignore */}
            ref?.current.pageFlip().flipNext();
    }

    const gotoPrevious = () => {
        if(ref.current)
            {/* @ts-ignore */}
            ref?.current.pageFlip().flipPrev();
    }

    return (
        <ContentContainer>
            {/* @ts-ignore */}
            <HTMLFlipBook
                ref={ref}
                className="mx-auto"
                width={600}
                height={800}
                maxShadowOpacity={0.4}
                onFlip={handlePageFlip}
            >
                {
                    FLIPBOOK_PAGE_DATA.map((flipbook_page: FlipBookPageDataType, index: number) => {
                        return (
                            <ScrapBookPage
                                pageNumber={index + 1}
                                image={flipbook_page.image}
                                info={flipbook_page.info}
                            />
                        )
                    })
                }
            </HTMLFlipBook>
            <div className="mt-3 flex justify-between items-center px-8">
                <ScrapBookInfo currentPageInfoIndex={currentPageInfoIndex} />
                <div className="flex items-center">
                    <Button disabled={currentPageInfoIndex === 0} size={"icon"} className="mx-1" onClick={gotoPrevious}><ChevronLeft /></Button>
                    <Button disabled={currentPageInfoIndex >= FLIPBOOK_PAGE_DATA.length - 2} size={"icon"} className="mx-1" onClick={gotoNext}><ChevronRight /></Button>
                </div>
                <ScrapBookInfo currentPageInfoIndex={currentPageInfoIndex + 1} />
            </div>
        </ContentContainer>
    )
}

export default Scrapbook;