import { CardLookalikeProps, CardLookalikeWithImageProps } from "types";

const CardLookalike = (props: CardLookalikeProps) => {
    const baseClasses = "mt-6 bg-white shadow-lg md:w-3/5 ";
    let computedClasses = baseClasses;
    if (props?.rotate) {
        computedClasses += props?.rotate + " ";
    }
    if (props?.centered) {
        computedClasses += "mx-auto ";
    }
    computedClasses += props?.classes;

    return (
        <div className={computedClasses}>
            {props?.children}
        </div>
    )
}

const CardLookalikeWithImage = (props: CardLookalikeWithImageProps) => {
    return (
        <CardLookalike rotate={props?.rotate} centered={props?.centered}>
            <img className="mx-auto border-[20px] border-white" src={props?.imageURL} />
            <p className="px-5 pb-4 text-sm md:text-md text-neutral-700">{props?.caption}</p>
        </CardLookalike>
    )
}

export { CardLookalikeWithImage };
export default CardLookalike;