// unit tests for CardService.getScrapbookCards
//
// No spies. The models are module-mocked against the shared fixture, so every
// assertion is toEqual on the scrapbook cards that come back.
// Fixture and stand-ins live in tests/helpers/cardFixtures.
//
// 1. returns only the five keys the scrapbook page needs
// 2. returns only cards flagged isInScrapbook
// 3. truncates a long description to 300 characters
// 4. appends an ellipsis even when nothing was cut
// 5. returns "" when the card has no description
// 6. picks the front (A) image even when the back is listed first
// 7. returns "" when the card has no images
// 8. returns "" when the card only has a back (B) image
// 9. flattens themes to plain names

import CardService from "../../../services/card";
import {
  BACK,
  cardsDb,
  givenCards,
  installReadMocks,
} from "../../helpers/cardFixtures";

jest.mock("../../../models/card");
jest.mock("../../../models/tag");

describe("CardService.getScrapbookCards", () => {
  let service: CardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CardService();
    installReadMocks();
  });

  it("returns only the five keys the scrapbook page needs", async () => {
    const result = await service.getScrapbookCards({});

    expect(Object.keys(result[0]).sort()).toEqual([
      "_id",
      "description",
      "image",
      "item",
      "themes",
    ]);
  });

  it("returns only the cards flagged isInScrapbook", async () => {
    const result = await service.getScrapbookCards({});

    expect(result.map((c: any) => c._id)).toEqual(["card1", "card3"]);
  });

  describe("description", () => {
    it("truncates a long description to 300 characters plus an ellipsis", async () => {
      const result = await service.getScrapbookCards({});

      expect(result[0].description).toEqual("L".repeat(300) + "...");
    });

    it("appends an ellipsis to a description short enough not to be cut", async () => {
      givenCards([{ ...cardsDb[0], description: "A short note." }]);

      const result = await service.getScrapbookCards({});

      expect(result[0].description).toEqual("A short note....");
    });

    it("returns an empty description when the card has none", async () => {
      const result = await service.getScrapbookCards({});

      expect(result[1].description).toEqual("");
    });
  });

  describe("image", () => {
    it("picks the front image even when the back one is listed first", async () => {
      const result = await service.getScrapbookCards({});

      expect(result[0].image).toEqual("/public/images/postcards/1000A.jpeg");
    });

    it("returns an empty image when the card has no images", async () => {
      const result = await service.getScrapbookCards({});

      expect(result[1].image).toEqual("");
    });

    it("returns an empty image when the card only has a back image", async () => {
      givenCards([{ ...cardsDb[0], imageLinks: [BACK] }]);

      const result = await service.getScrapbookCards({});

      expect(result[0].image).toEqual("");
    });
  });

  it("flattens themes to plain names", async () => {
    const result = await service.getScrapbookCards({});

    expect(result[0].themes).toEqual(["Racist Caricature", "United States"]);
  });
});
