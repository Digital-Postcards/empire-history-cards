import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { SingleCard } from "types";

const MasonryList = (props: { data: SingleCard[]} ) => {
    if (props?.data === null) {
        return <p>Error displaying cards</p>
    }
    return (
        <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}
        >
            <Masonry gutter={"1rem"}>
                {props?.data.map((item: any) => {
                    return (
                        <div key={item._id} className="group h-fit relative cursor-pointer hover:-translate-y-1 hover:shadow-3xl transition-all duration-300">
                            <img
                                onClick={() => window.location.href = "/cards/" + item.item + "/" + item._id}
                                className="rounded-lg"
                                src={"http://localhost:3002"+ "/static" + item.imageLinks[0].link}
                            />
                            <div className="absolute bottom-0 md:h-48 h-60 w-[100%] p-3 flex-col justify-end text-background rounded-b-lg bg-gradient-to-t from-black to-transparent md:group-hover:flex flex md:hidden">
                                <p className="md:text-lg text-md font-bold">Postcard #{item.number}</p>
                                <p className="text-sm md:block">{item.description.slice(0, 50)}</p>
                            </div>
                        </div>
                    )
                })}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default MasonryList;