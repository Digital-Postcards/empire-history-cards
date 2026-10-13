// unit tests for CardService.getCardById
//
// No spies. The models are module-mocked against the shared fixture, so the
// assertions are toEqual on what comes back.
// Fixture and stand-ins live in tests/helpers/cardFixtures.
//
// 1. returns the card with its themes flattened to names
// 2. returns null when no card matches
// 3. throws when the stored card has no themes array

import CardService from "../../../services/card";
import CardModel from "../../../models/card";
import {
  cardsDb,
  expectedDto,
  installReadMocks,
} from "../../helpers/cardFixtures";

jest.mock("../../../models/card");
jest.mock("../../../models/tag");

describe("CardService.getCardById", () => {
  let service: CardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CardService();
    installReadMocks();
  });

  it("returns the card with its themes flattened to names", async () => {
    const result = await service.getCardById("card1");

    expect(result).toEqual(expectedDto(cardsDb[0]));
  });

  it("returns null when no card matches the id", async () => {
    const result = await service.getCardById("doesnotexist");

    expect(result).toBeNull();
  });

  // Unlike getCardsByFilter, this one reads _doc.themes with no optional
  // chaining, so a card stored without a themes array blows up.
  it("throws when the stored card has no themes array", async () => {
    (CardModel.findById as jest.Mock).mockImplementation(() => ({
      populate: () => Promise.resolve({ _doc: { _id: "card9" } }),
    }));

    await expect(service.getCardById("card9")).rejects.toThrow(TypeError);
  });
});
