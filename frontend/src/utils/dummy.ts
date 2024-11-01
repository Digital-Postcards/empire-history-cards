import { FlipBookPageDataType, MasonryListProps } from "types";

const CAROUSEL_IMAGE_URLS: string[] = [
    "/images/carousel/one.jpg",
    "/images/carousel/four.jpg",
    "/images/carousel/two.jpg",
    "/images/carousel/three.jpg",
    "/images/carousel/two.jpg"
];

const WIKI_IMAGES: MasonryListProps = {
  data: [
    {
      type: "postcard",
      image: "/images/wiki/one.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
      image: "/images/wiki/two.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
      image: "/images/wiki/three.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
      image: "/images/wiki/four.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
      image: "/images/wiki/five.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
      image: "/images/wiki/six.jpg",
      cardURL: "/abcdef"
    },
    {
      type: "postcard",
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
];

const DUMMY_COORDINATES = [
  { latitude: 37.7749, longitude: -122.4194 },
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 34.0522, longitude: -118.2437 },
  { latitude: 34.0522, longitude: -110.2437 },
  { latitude: 54.0522, longitude: -118.2437 },
  { latitude: 39.0522, longitude: -130.2437 },
  { latitude: 34.0522, longitude: -148.2437 },
  { latitude: 34.0522, longitude: -146.2437 },
  { latitude: 34.0522, longitude: -148.2437 },
  { latitude: 34.0522, longitude: -142.2437 },
  { latitude: 34.0522, longitude: -140.2437 },
  { latitude: 34.0522, longitude: -148.2437 },
];

export {
    CAROUSEL_IMAGE_URLS,
    WIKI_IMAGES,
    DUMMY_TAGS,
    FLIPBOOK_PAGE_DATA,
    DUMMY_COORDINATES
}