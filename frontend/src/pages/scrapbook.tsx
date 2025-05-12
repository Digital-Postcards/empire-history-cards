import { ContentContainer, Loader } from "components/common";
import HTMLFlipBook from "react-pageflip";
import { FlipBookPageDataType } from "types";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { ScrapbookEmpty, ScrapBookInfo, ScrapBookPage } from "components/scrapbook";

import { useApi } from "hooks";
import { Error } from "components/error";

const Scrapbook = () => {
    const { data, error, isLoading, fetchData } = useApi("/cards/scrapbook", { method: "GET" });
    const getData = async () => {
        await fetchData();
    };

    useEffect(() => {
        getData();
    }, []);

    const [currentPageInfoIndex, setCurrentPageInfoIndex] = useState<number>(0);
    const ref = useRef();

    const handlePageFlip = () => {
        /* @ts-expect-error type does not exist */
        setCurrentPageInfoIndex(ref?.current.pageFlip().getCurrentPageIndex());
    };

    const gotoNext = () => {
        if (ref.current) {
            /* @ts-expect-error type does not exist */
            ref?.current.pageFlip().flipNext();
        }
    };

    const gotoPrevious = () => {
        if (ref.current) {
            /* @ts-expect-error type does not exist */
            ref?.current.pageFlip().flipPrev();
        }
    };

    if (isLoading) return <Loader isFullSize={true} />;

    if (!data) {
        return (
            <ContentContainer>
                <Error errorType="data-not-found" />
            </ContentContainer>
        );
    }

    if (error) {
        return (
            <ContentContainer>
                <Error errorType="server-error" />
            </ContentContainer>
        );
    }

    return (
        <ContentContainer>
            <div className="mb-8 prose max-w-none text-justify">
                <p className="mb-4">
                    During the late 19th and early 20th centuries, the practice of scrapbooking emerged as a popular
                    domestic and cultural activity, particularly among middle-classes in Europe and North America.
                    Scrapbooks functioned as both personal memory repositories and aesthetic artifacts, documenting how
                    people collected ephemera, such as trade cards and postcards.
                </p>
                <p className="mb-4">
                    Trade cards—small, illustrated advertisements distributed by manufacturers and merchants—became
                    widely collected in the post-Civil War United States, and in industrializing Europe, especially
                    during the 1870s and 1880s. Their vibrant chromolithographed imagery and thematic variety made them
                    desirable objects not only for their commercial content but also for their artistic appeal.
                    Similarly, postcards gained popularity in the early-1900s with the advent of affordable postal
                    services and international postcard exchanges. Postcards, as Lydia Pyne notes, were the
                    &quot;World&apos;s First Social Network&quot;, allowing people to collect memories, images, and
                    notes sent to and from their loved ones. These items were often preserved in scrapbooks both for
                    their visual and sentimental value.
                </p>
                <p className="mb-4">
                    Scrapbooking in this era was influenced by Victorian ideals of domesticity and sentimentality. It
                    became a creative outlet that allowed individuals—most often women—to curate their personal
                    engagement with industrial modernity, print capitalism, as well as new imperialism, anti-Black
                    racism, Asian exclusion, racial segregation, and rue about the &quot;Servant Problem&quot;.
                </p>
                <p className="mb-4">
                    We are building a digital scrapbook for our project, that will allow users to curate and collect
                    their own personalized scrapbook, and download it as a teaching and learning tool, to understand and
                    reflect on how mass-produced ephemera upheld global hierarchies of race, gender, and domestic labor.
                </p>
            </div>
            {data === null || ((data as FlipBookPageDataType[]).length === 0 && <ScrapbookEmpty />)}
            {data !== null && (data as FlipBookPageDataType[]).length != 0 && (
                <>
                    {/* @ts-expect-error type does not exist */}
                    <HTMLFlipBook
                        ref={ref}
                        className="mx-auto"
                        width={500}
                        height={800}
                        maxShadowOpacity={0.4}
                        onFlip={handlePageFlip}
                        size="stretch">
                        {(data as FlipBookPageDataType[]).map((flipbook_page: FlipBookPageDataType, index: number) => {
                            return (
                                <ScrapBookPage
                                    key={flipbook_page._id}
                                    _id={flipbook_page._id}
                                    item={flipbook_page.item}
                                    pageNumber={index + 1}
                                    image={flipbook_page.image}
                                    description={flipbook_page.description}
                                    themes={flipbook_page.themes}
                                />
                            );
                        })}
                    </HTMLFlipBook>
                    <div className="mt-6 flex justify-between items-center md:px-2 px-0 pb-24">
                        <ScrapBookInfo
                            currentPageInfoIndex={currentPageInfoIndex}
                            data={data[currentPageInfoIndex]}
                            isDisabled={currentPageInfoIndex === (data as FlipBookPageDataType[]).length}
                        />
                        <div className="flex items-center">
                            <Button
                                disabled={currentPageInfoIndex === 0}
                                size={"icon"}
                                className="mx-1"
                                onClick={gotoPrevious}>
                                <ChevronLeft />
                            </Button>
                            <Button
                                disabled={currentPageInfoIndex >= (data as FlipBookPageDataType[]).length - 2}
                                size={"icon"}
                                className="mx-1"
                                onClick={gotoNext}>
                                <ChevronRight />
                            </Button>
                        </div>
                        <ScrapBookInfo
                            currentPageInfoIndex={currentPageInfoIndex + 1}
                            data={data[currentPageInfoIndex + 1]}
                            isDisabled={currentPageInfoIndex === (data as FlipBookPageDataType[]).length}
                        />
                    </div>
                </>
            )}
        </ContentContainer>
    );
};

export default Scrapbook;
