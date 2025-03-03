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
                imageURL="/images/about/history-team.jpeg"
                caption="The History Team from The College of New Jersey: (from left) Sarah Adamo, Sapphire Srigley, Abhishta Tantry, George Kapetanakis, Satya Shikha Chakraborty, Carolyn Carmody, Phoebe Abeles, and Lucy Fleischmann."
            />
            <p className="mt-12 text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph3 }} />
            <div className="flex md:flex-row flex-col">
                <CardLookalikeWithImage
                    imageURL="/images/about/seminar.jpg"
                    caption="The Seminar culminated in a History Exhibition curated by Prof. Chakraborty and the History/ Art history students at the TCNJ Art Gallery in May 2022."
                />
                <CardLookalikeWithImage
                    rotate="rotate-3"
                    imageURL="/images/about/2024.jpg"
                    caption="In 2024, TCNJ History students Marisa Valdes and Benjamin Lieberman worked on the project."
                />
            </div>
            <p className="mt-12 text-justify" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_CONTENT.paragraph4 }} />
            <TeamSection teamMembers={ABOUT_PAGE_CONTENT.csTeam} />
        </ContentContainer>
    );
};

export default About;
