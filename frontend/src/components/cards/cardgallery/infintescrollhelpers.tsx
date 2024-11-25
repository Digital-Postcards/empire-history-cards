import { Loader } from "components/common";

const InfiniteScrollLoader = () => {
    return (
        <div className="p-8 flex justify-center">
            <Loader />
        </div>
    );
};

const InfiniteScrollEnd = (props: { type: string; noCards: boolean }) => {
    return (
        <div className="p-8 text-center">
            <code className="tracking-wider uppercase text-neutral-600">
                {!props?.noCards && "- NO MORE " + props?.type + "s -"}
                {props?.noCards && "- NO CARDS FOUND -"}
            </code>
        </div>
    );
};

export { InfiniteScrollLoader, InfiniteScrollEnd };
