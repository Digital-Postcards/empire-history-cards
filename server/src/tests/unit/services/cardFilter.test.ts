// unit tests for CardService.getCardsByFilter
//
// No spies. The models are module-mocked and CardModel.find actually applies
// the filter it is handed to the shared fixture, so every assertion is toEqual
// on the cards that come back rather than a check on how the query was built.
// Fixture and stand-ins live in tests/helpers/cardFixtures.
//
// type
//  1. a type that matches returns those cards
//  2. a numeric type is passed through unchanged, so it matches nothing
// year
//  3. year is a substring match, so a partial year matches several cards
//  4. a year no card carries returns nothing
// withTags
//  5. withTags absent leaves the theme filter off entirely
//  6. withTags null behaves the same as absent
//  7. a single theme name returns every card carrying it
//  8. several theme names are ANDed, not ORed
//  9. url-encoded theme names are decoded before lookup
// 10. comma-joined theme names are not split, so they match nothing
// 11. an unknown theme name matches nothing
// originalLocation
// 12. a plain string matches no card
// 13. the stored coordinate object does match

import CardService from "../../../services/card";
import { cardsDb, expectedDto, installReadMocks } from "../../helpers/cardFixtures";

jest.mock("../../../models/card");
jest.mock("../../../models/tag");

describe("CardService.getCardsByFilter", () => {
  let service: CardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CardService();
    installReadMocks();
  });

  describe("type", () => {
    it("returns the cards of that type", async () => {
      const result = await service.getCardsByFilter({ type: "postcard" });

      expect(result).toEqual([expectedDto(cardsDb[0]), expectedDto(cardsDb[1])]);
    });

    it("passes a numeric type through unchanged, so it matches nothing", async () => {
      const result = await service.getCardsByFilter({ type: 123 });

      expect(result).toEqual([]);
    });
  });

  describe("year", () => {
    it("matches year as a substring, so a partial year returns several cards", async () => {
      const result = await service.getCardsByFilter({ year: "19" });

      expect(result).toEqual([expectedDto(cardsDb[0]), expectedDto(cardsDb[1])]);
    });

    it("returns nothing for a year no card carries", async () => {
      const result = await service.getCardsByFilter({ year: "2026" });

      expect(result).toEqual([]);
    });
  });

  describe("withTags", () => {
    it("applies no theme filter when withTags is absent", async () => {
      const result = await service.getCardsByFilter({});

      expect(result).toEqual(cardsDb.map(expectedDto));
    });

    it("applies no theme filter when withTags is null", async () => {
      const result = await service.getCardsByFilter({ withTags: null });

      expect(result).toEqual(cardsDb.map(expectedDto));
    });

    it("returns every card carrying a single theme", async () => {
      const result = await service.getCardsByFilter({
        withTags: "Racist Caricature",
      });

      expect(result).toEqual([expectedDto(cardsDb[0]), expectedDto(cardsDb[1])]);
    });

    it("ANDs several themes together rather than ORing them", async () => {
      const result = await service.getCardsByFilter({
        withTags: ["Racist Caricature", "United States"],
      });

      expect(result).toEqual([expectedDto(cardsDb[0])]);
    });

    it("decodes url-encoded theme names before looking them up", async () => {
      const result = await service.getCardsByFilter({
        withTags: "Racist%20Caricature",
      });

      expect(result).toEqual([expectedDto(cardsDb[0]), expectedDto(cardsDb[1])]);
    });

    it("does not split comma-joined theme names, so they match nothing", async () => {
      const result = await service.getCardsByFilter({
        withTags: "Racist Caricature,United States",
      });

      expect(result).toEqual([]);
    });

    it("returns nothing for a theme name that does not exist", async () => {
      const result = await service.getCardsByFilter({ withTags: "Nonexistent" });

      expect(result).toEqual([]);
    });
  });

  describe("originalLocation", () => {
    it("returns nothing when given a plain string instead of coordinates", async () => {
      const result = await service.getCardsByFilter({
        originalLocation: "Chicago",
      });

      expect(result).toEqual([]);
    });

    it("matches when given the stored coordinate object", async () => {
      const result = await service.getCardsByFilter({
        originalLocation: { latitude: 41.87, longitude: -87.62 },
      });

      expect(result).toEqual([expectedDto(cardsDb[0])]);
    });
  });
});
