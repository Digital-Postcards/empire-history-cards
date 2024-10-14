import { NavLinkType } from "types"

const MAIN_NAV_LINKS: NavLinkType[] = [
    {
        label: "Home",
        path: "/"
    },
    {
        label: "History",
        path: "/history"
    },
    {
        label: "Project",
        path: "/project"
    },
    {
        label: "Flipbook",
        path: "/flipbook"
    }
]

const SIDEBAR_NAV_LINKS: NavLinkType[] = [
    {
        label: "Map",
        icon: "mapicon",
        path: "/exhibit/map"
    },
    {
        label: "Wiki",
        icon: "wikiicon",
        path: "/exhibit/wiki"
    },
    {
        label: "Themes",
        icon: "tagsicon",
        path: "/exhibit/themes"
    },
    {
        label: "Home",
        icon: "homeicon",
        path: "/"
    }
]

export {
    MAIN_NAV_LINKS,
    SIDEBAR_NAV_LINKS
}