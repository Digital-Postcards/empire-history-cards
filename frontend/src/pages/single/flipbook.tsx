import { ContentContainer } from "components/common"
import HTMLFlipBook from "react-pageflip";

const Flipbook = () => {
    return (
        <ContentContainer>
            {/* @ts-ignore */}
            <HTMLFlipBook
                className="mx-auto"
                width={600}
                height={800}
            >
                <div className="bg-neutral-300 h-full rounded-lg p-6">
                    <div className="mt-2">
                        <div className="w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                        <img className="mx-auto h-[680px] border-white border-[1rem]" src="/images/wiki/two.jpg" />
                        <div className="w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
                    </div>
                </div>
                <div className="bg-neutral-300 h-full rounded-lg p-6">
                    <div className="mt-2">
                        <div className="w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                        <img className="mx-auto h-[700px] border-white border-[1rem]" src="/images/wiki/one.jpg" />
                        <div className="w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
                    </div>
                </div>
                <div className="bg-neutral-300 h-full rounded-lg p-6">
                    <div className="mt-2">
                        <div className="w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                        <img className="mx-auto h-[700px] border-white border-[1rem]" src="/images/wiki/six.jpg" />
                        <div className="w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
                    </div>
                </div>
                <div className="bg-neutral-300 h-full rounded-lg p-6">
                    <div className="mt-2">
                        <div className="w-48 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed top-20 left-0"></div>
                        <img className="mx-auto h-[700px] border-white border-[1rem]" src="/images/wiki/four.jpg" />
                        <div className="w-36 h-10 bg-neutral-100 opacity-50 -rotate-45 fixed bottom-20 right-0"></div>
                    </div>
                </div>
            </HTMLFlipBook>
        </ContentContainer>
    )
}

export default Flipbook;