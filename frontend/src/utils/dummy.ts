import { FlipBookPageDataType, MasonryListProps } from "types";

const CAROUSEL_IMAGE_URLS: string[] = [
    "/images/carousel/one.jpg",
    "/images/carousel/two.jpg",
    "/images/carousel/three.jpg",
    "/images/carousel/four.jpg"
];

const WIKI_IMAGES: MasonryListProps = {
  data: [
    {
      image: "/images/wiki/one.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/two.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/three.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/four.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/five.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/six.jpg",
      cardURL: "/abcdef"
    },
    {
      image: "/images/wiki/seven.jpg",
      cardURL: "/abcdef"
    }
  ]
}

const DUMMY_TAGS: string[] = ["Animalization", "Emasculation", "Mammy Stereotype"];

const FLIPBOOK_PAGE_DATA: FlipBookPageDataType[] = [
  {
    image: "/images/wiki/two.jpg",
    info: "0. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    image: "/images/wiki/one.jpg",
    info: "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    image: "/images/wiki/six.jpg",
    info: "2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    image: "/images/wiki/four.jpg",
    info: "3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    image: "/images/wiki/one.jpg",
    info: "5. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
]

export {
    CAROUSEL_IMAGE_URLS,
    WIKI_IMAGES,
    DUMMY_TAGS,
    FLIPBOOK_PAGE_DATA
}