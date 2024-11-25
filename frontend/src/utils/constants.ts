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
    paragraph1: `The <em>Visual Culture of Domestic Labor</em> project evolved from the personal collection of historical trade cards and postcards of Satya Shikha Chakraborty, Assistant Professor of History, at The College of New Jersey.
                She started collecting back in 2013, while researching the colonial history of Indian ayahs for her PhD. In 2020, while sharing her collection with Joydeep Mitra, Research Assistant Professor of Computer Science, at Stony Brook University, the idea
                of a collaborative digital history project was born, that would deploy the historical analysis skills of TCNJ History students, and the technological/coding skills of Stony Brook Computer Science students.`,
    paragraph2: `The History/Art History students worked on analyzing the trade cards and postcards, and writing transcripts for the digital exhibition, as part of a group research seminar “Race, Gender, and the Visual
                Culture of Domestic Labor: Trade Cards and Postcards from the age of New Imperialism, Jim Crow Racism, and Asian Exclusion”, taught by Prof. Chakraborty in Spring 2022.`,
    paragraph3: `Computer Science students from Northeastern University, guided by Professor Mitra, worked on digitizing the work that was done by the History team so that the collection of historical post cards and trade cards would be more accessible and interactive.`,
    csTeam: [
        {
            imageURL: "/images/about/seminar.jpg",
            caption: "Prof. Joydeep Mitra, Khoury College of Computer Sciences",
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
