import { ChoiceCard } from "components/dashboard/wiki";
    
const Wiki = () => {
    return (
        <>
            <div className="col-span-5 flex justify-center items-center gap-16">
                <ChoiceCard
                    type="postcard"
                    title="Postcards"
                    description="Lorem ipsum odor amet, consectetuer adipiscing elit. Tempus sociosqu phasellus vestibulum scelerisque dignissim? Hac penatibus non tellus eget mus laoreet. Ipsum aenean magnis massa enim enim."
                    image="/images/wiki/three.jpg"
                />
                <ChoiceCard
                    type="tradecard"
                    title="Tradecards"
                    description="Lorem ipsum odor amet, consectetuer adipiscing elit. Tempus sociosqu phasellus vestibulum scelerisque dignissim? Hac penatibus non tellus eget mus laoreet. Ipsum aenean magnis massa enim enim."
                    image="/images/wiki/seven.jpg"
                />
            </div>
        </>
    )
}

export default Wiki;