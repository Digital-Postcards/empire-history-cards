import { CardLookalikeWithImage, ContentContainer } from "components/common";
import TeamSection from "components/common/teammembers";
import { ABOUT_PAGE_CONTENT } from "utils";

const About = () => {
    return (
        <ContentContainer>
            <p className="text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph1 }} />
            <p className="mt-4 text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph2 }} />
            <CardLookalikeWithImage
                centered
                rotate="-rotate-3"
                imageURL="/images/about/history_team_2022.jpeg"
                caption="Exhibition curated by Prof. Chakraborty and her history students at the TCNJ Art Gallery in 2022. (from left) Sarah Adamo, Sapphire Srigley, Abhishta Tantry, George Kapetanakis, Satya Shikha Chakraborty, Carolyn Carmody, Phoebe Abeles, and Lucy Fleischmann."
            />
            <p className="mt-12 text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph3 }} />
            <div className="flex md:flex-row flex-col">
                <CardLookalikeWithImage
                    rotate="rotate-3"
                    imageURL="/images/about/2024.jpg"
                    caption="In 2024, TCNJ History students Marisa Valdes and Benjamin Lieberman worked on the project."
                />
                <CardLookalikeWithImage
                    imageURL="/images/about/history_team_2025.jpeg"
                    caption="In 2025, Arefa Khajanchi, Kay Reed, and Madison Moran worked on the project, analyzing postcards from the French, Dutch, and British empires."
                />
            </div>
            <p className="mt-12 text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph4 }} />
            <TeamSection teamMembers={ABOUT_PAGE_CONTENT.csTeam} />
        </ContentContainer>
    );
};

export default About;
