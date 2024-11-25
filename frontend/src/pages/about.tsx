import { CardLookalike, CardLookalikeWithImage, ContentContainer } from "components/common"
import { ABOUT_PAGE_CONTENT } from "utils";

const About = () => {
    return (
        <ContentContainer>
            <p dangerouslySetInnerHTML={{__html: ABOUT_PAGE_CONTENT.paragraph1}} />
            <CardLookalikeWithImage
                centered
                rotate="-rotate-3"
                imageURL="/images/about/history-team.jpeg"
                caption="The History Team from The College of New Jersey: (from left) Sarah Adamo, Sapphire Srigley, Abhishta Tantry, George Kapetanakis, Satya Shikha Chakraborty, Carolyn Carmody, Phoebe Abeles, and Lucy Fleischmann." 
            />
            <p className="mt-12" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph2 }} /> 
            <div className="flex md:flex-row flex-col">
                <CardLookalikeWithImage
                    imageURL="/images/about/seminar.jpg"
                    caption="The Seminar culminated in a History Exhibition curated by Prof. Chakraborty and the History/ Art history students at the TCNJ Art Gallery in May 2022."
                />
                <CardLookalikeWithImage
                    rotate="rotate-3"
                    imageURL="/images/about/2024.jpg"
                    caption="In 2024, TCNJ History students Marisa Valdes and Benjamin Lieberman (below) worked on the project."
                />
            </div>
            <p className="mt-12" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph3 }} />
            <CardLookalike rotate="-rotate-2" centered classes="flex">
                {
                    ABOUT_PAGE_CONTENT.csTeam.map((person: any) => {
                        return(
                            <div>
                                <img className="mx-auto border-[20px] border-white" src={person.imageURL} />
                                <p className="px-5 pb-4 text-sm md:text-md text-neutral-700">{person.caption}</p>
                            </div>
                        )
                    })
                }
            </CardLookalike>
        </ContentContainer>
    )
}

export default About;