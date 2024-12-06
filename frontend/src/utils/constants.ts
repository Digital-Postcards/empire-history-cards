import { NavLinkType } from "types";

const API_URL = process.env.REACT_APP_SERVER_URL + "/api";

const MAIN_NAV_LINKS: NavLinkType[] = [
    {
        label: "Introduction",
        path: "/",
    },
    {
        label: "History",
        path: "/history",
    },
    {
        label: "Scrapbook",
        path: "/flipbook",
    },
    {
        label: "Map",
        path: "/map",
    },
    {
        label: "Themes",
        path: "/themes",
    },
    {
        label: "Cards",
        path: "/cards",
    },
    {
        label: "Ethics of Representation",
        path: "/ethics-of-representation",
    },
    {
        label: "About",
        path: "/about",
    },
];

const MAX_ZOOM_FOR_MAP: number = 8;

const ABOUT_PAGE_CONTENT = {
    paragraph1: `The <em>Visual Culture of Domestic Labor</em> Digital Humanities project evolved from the personal collection of historical trade cards and postcards of <a href="https://history.tcnj.edu/satya-shikha-chakraborty/" target="_blank">Satya Shikha Chakraborty, Assistant Professor of History,
                at The College of New Jersey</a>. She started collecting back in 2013, while researching the colonial history of Indian ayahs for her PhD. In 2020, while sharing her collection with Joydeep Mitra, who at the time
                was a Research Assistant Professor of Computer Science at Stony Brook University, the idea of a collaborative digital history project was born, that would deploy the historical analysis skills of TCNJ History 
                students, and the technological/ coding skills of Stony Brook Computer Science students.`,
    paragraph2: `In 2024, the DH project moved with <a href="https://www.khoury.northeastern.edu/people/joydeep-mitra/" target="_blank">Dr. Mitra to Northeastern University</a>. This new version uses feedback we received from 
                the <a href="https://library.brown.edu/neh-institute-born-digital-scholarly-publishing/" target="_blank">2024 NEH Institute on Digital Humanities at Brown University</a>. The project has also been supported by mini-grants from the HSS Dean's Office and Center for Excellence in Teaching and Learning (CETL) at The College of New Jersey. `,
    paragraph3: `The History/Art History students worked on analyzing the trade cards and postcards, and writing transcripts for the digital exhibition, as part of a group research seminar <em>Race, Gender, and the Visual
                Culture of Domestic Labor: Trade Cards and Postcards from the age of New Imperialism, Jim Crow Racism, and Asian Exclusion</em>, taught by Prof. Chakraborty in Spring 2022.`,
    paragraph4: `The DH project has been a collaborative effort driven by talented Computer Science students from two institutions. The <span><a href="https://empirehistorycards.cs.stonybrook.edu/" target="_blank">first version</a></span> of the project was designed and developed by students at Stony Brook University, showcasing their innovative spirit and technical expertise.
                <br><br>Building on this foundation, Zitong Bao and Parthiv Menon, Computer Science students from the Khoury College of Computing at Northeastern University, enhanced the application with new visualization features to improve its functionality and user experience. This work was supported by the Khoury Apprenticeship program, which provided a stipend for Zitong Bao, enabling dedicated focus on the project. The digital resources provided by Khoury College have also been instrumental in hosting the application and ensuring its accessibility.
                <br><br>Both iterations of the project were guided by Prof. Joydeep Mitra, whose mentorship helped bring this project to life.
                `,
    csTeam: [
        {
            imageURL: "/images/about/profmitra.png",
            caption: "Prof. Joydeep Mitra",
        },
        {
            imageURL: "/images/about/seminar.jpg",
            caption: "Parthiv Menon, MS CS student",
        },
        {
            imageURL: "/images/about/seminar.jpg",
            caption: "Zitong Bao, MS CS student",
        },
    ],
};

export { API_URL, MAIN_NAV_LINKS, MAX_ZOOM_FOR_MAP, ABOUT_PAGE_CONTENT };
