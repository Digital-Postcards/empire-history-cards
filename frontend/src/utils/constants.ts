import { NavLinkType } from "types";

const API_URL = process.env.REACT_APP_SERVER_URL + "/api";

const MAIN_NAV_LINKS: NavLinkType[] = [
    {
        label: "Introduction",
        path: "/"
    },
    {
        label: "History",
        path: "/history"
    },
    {
        label: "Scrapbook",
        path: "/flipbook"
    },
    {
        label: "Map",
        path: "/map"
    },
    {
        label: "Themes",
        path: "/themes"
    },
    {
        label: "Cards",
        path: "/cards"
    },
    {
        label: "Ethics of Representation",
        path: "/ethics-of-representation"
    },
    {
        label: "About",
        path: "/about"
    }
]

const MAX_ZOOM_FOR_MAP: number = 8;

export {
    API_URL,
    MAIN_NAV_LINKS,
    MAX_ZOOM_FOR_MAP
}