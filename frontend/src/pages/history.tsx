import { ContentContainer } from "components/common";
import { ScrollText /*Tags*/ } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HISTORY_PAGE_CONTENT } from "utils/constants";

const TextSection = (props: {
    title: string;
    content: string;
    image?: string;
    imagePosition?: "left" | "right"; // Add image position prop,
    tag?: string | "";
}) => {
    const navigate = useNavigate();
    if (props.image) {
        return (
            <div className="mt-6">
                <h2 className="md:sticky top-12 bg-background py-3 lg:text-5xl md:text-4xl text-3xl font-light tracking-wider text-neutral-500 z-10">
                    {props?.title}
                </h2>
                <div
                    className={`flex flex-col md:flex-row gap-6 mt-4 ${
                        props.imagePosition === "right" ? "md:flex-row-reverse" : ""
                    }`}>
                    {/* Image Section */}
                    {props.image && (
                        <div className="w-full md:w-1/2 lg:w-1/3 relative group animate-fade-in">
                            {/* Image with Gradient Overlay */}
                            <div className="relative overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={props.image}
                                    alt={props.title}
                                    className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {/* "View More" Button */}
                                <button
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-xs px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={() => {
                                        // TODO: update this later
                                        if (props.tag) navigate(`/cards?withTags=${props.tag}`);
                                    }}>
                                    View More
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Text Section */}
                    <div
                        className={`w-full ${props.image ? "md:w-1/2 lg:w-2/3" : ""} animate-slide-in text-neutral-600`}>
                        {props?.content}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="mt-6">
                <h2 className="md:sticky top-12 bg-background py-3 lg:text-5xl md:text-4xl text-3xl font-light tracking-wider text-neutral-500">
                    {props?.title}
                </h2>
                <p className="mt-2 text-neutral-600 text-lg">{props?.content}</p>
            </div>
        );
    }
};

// const TextSectionParagraph = (props: { children: string }) => {
//     return <p className="mt-2 text-neutral-600 text-lg">{props?.children}</p>;
// };

const History = () => {
    return (
        <ContentContainer>
            <div>
                {HISTORY_PAGE_CONTENT?.about_themes?.map((section: any, index: number) => (
                    <TextSection
                        key={index}
                        title={section.title}
                        content={section.content}
                        image={section.image}
                        imagePosition={index % 2 === 0 ? "left" : "right"}
                        tag={section.tag}
                    />
                ))}
            </div>
            <div className="w-full h-[1px] my-12 bg-neutral-500"></div>
            <div className="pb-36">
                <div className="flex gap-2">
                    <ScrollText />
                    <h1 className="text-xl font-bold tracking-tighter text-neutral-goreground">CONCLUSION</h1>
                </div>
                {HISTORY_PAGE_CONTENT?.conclusion?.map((section: any, index: number) => (
                    <TextSection
                        key={index}
                        title={section.title}
                        content={section.content}
                        // image={section.image}
                        tag={section.tag}
                    />
                ))}
            </div>
        </ContentContainer>
    );
};

export default History;
