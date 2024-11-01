import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { MasonryListProps } from "types";

const MasonryList = (props: MasonryListProps) => {
    return (
        <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}
        >
            <Masonry gutter={"1rem"}>
                {props?.data.map((item: any) => {
                    return (
                        <div key={item.cardURL} className="group h-fit relative cursor-pointer hover:-translate-y-1 hover:shadow-3xl transition-all duration-300">
                            <img
                                onClick={() => window.location.href = "/cards/" + item.type + item.cardURL}
                                className="rounded-lg"
                                src={item.image}
                            />
                            <div className="absolute bottom-0 md:h-48 h-60 w-[100%] p-3 flex-col justify-end text-background rounded-b-lg bg-gradient-to-t from-black to-transparent md:group-hover:flex flex md:hidden">
                                <p className="md:text-lg text-md font-bold">Postcard #20</p>
                                <p className="text-sm md:block">Lorem ipsum odor amet, consectetuer adipiscing elit. Suscipit felis dolor arcu etiam in mus. Sed litora...</p>
                            </div>
                        </div>
                    )
                })}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default MasonryList;