import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { MasonryListProps } from "types";

const MasonryList = (props: MasonryListProps) => {
    return (
        <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
        >
            <Masonry gutter={"1rem"}>
                {props?.data.map((item: any) => {
                    return <img
                        onClick={() => window.location.href = "/exhibit/wiki" + item.cardURL}
                        className="rounded-md shadow-xl cursor-pointer hover:-translate-y-1 hover:shadow-3xl transition-all duration-300"
                        src={item.image}
                    />
                })}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default MasonryList;