import { ContentContainer, Loader } from "components/common"
import HTMLFlipBook from "react-pageflip";
import { FlipBookPageDataType } from "types";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { ScrapbookEmpty, ScrapBookInfo, ScrapBookPage } from "components/scrapbook";

import { useApi } from "hooks";

const Scrapbook = () => {

    const { data, error, isLoading, fetchData } = useApi("/cards/scrapbook", { method: "GET" });
    const getData = async () => {
        await fetchData();
    }

    useEffect(() => {
        getData();
    }, []);

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

    if (isLoading)
        return <Loader isFullSize={true}/>
    
    if (error) {
        return (
            <ContentContainer>
                Some error happenend
            </ContentContainer>
        )
    }

    return (
        <ContentContainer>
            {
                data === null || (data as FlipBookPageDataType[]).length === 0
                && <ScrapbookEmpty />
            }
            {
                    data !== null && (data as FlipBookPageDataType[]).length != 0 &&
                    <>
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
                                (data as FlipBookPageDataType[]).map((flipbook_page: FlipBookPageDataType, index: number) => {
                                    return (
                                        <ScrapBookPage
                                            _id={flipbook_page._id}
                                            pageNumber={index + 1}
                                            image={flipbook_page.image}
                                            description={flipbook_page.description}
                                            themes={flipbook_page.themes}
                                        />
                                    )
                                })
                            }
                        </HTMLFlipBook>
                        <div className="mt-3 flex justify-between items-center px-8 pb-24">
                            <ScrapBookInfo currentPageInfoIndex={currentPageInfoIndex} data={data[currentPageInfoIndex]} isDisabled={currentPageInfoIndex === (data as FlipBookPageDataType[]).length} />
                            <div className="flex items-center">
                                <Button disabled={currentPageInfoIndex === 0} size={"icon"} className="mx-1" onClick={gotoPrevious}><ChevronLeft /></Button>
                                <Button disabled={currentPageInfoIndex >= (data as FlipBookPageDataType[]).length - 2} size={"icon"} className="mx-1" onClick={gotoNext}><ChevronRight /></Button>
                            </div>
                            <ScrapBookInfo currentPageInfoIndex={currentPageInfoIndex + 1} data={data[currentPageInfoIndex + 1]} isDisabled={currentPageInfoIndex === (data as FlipBookPageDataType[]).length} />
                        </div>
                    </>
            }
        </ContentContainer>
    )
}

export default Scrapbook;