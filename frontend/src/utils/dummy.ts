import { MasonryListProps } from "types";

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

export {
    CAROUSEL_IMAGE_URLS,
    WIKI_IMAGES
}