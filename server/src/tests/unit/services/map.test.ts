// unit tests for MapService - the only layer that touches mongoose directly,
// so every assertion here is about the query we hand to the models
//
// getCardsByEmpire
// 1. test that no empire means no db calls happen, just an empty result
// 2. test that a valid empire returns the matching real cards
// 3. test that empire matching is case sensitive, no normalization happens
// 4. test that empire is not trimmed of extra whitespace
// 5. test that an empire with no matching countries still builds a valid query
// 6. test that a given projection is passed through untouched
// 7. test that projection defaults to undefined when not given
//
// getCountries
// 8. test that an empire filters the query
// 9. test that no empire queries every country
// 10. test that an empty empire is treated as no empire
// 11. test that whatever the model returns is handed back untouched
// 12. test that a db error propagates to the caller
//
// updateCountryCoordinates
// 13. test that the id and coordinates reach findByIdAndUpdate correctly
// 14. test that a missing country returns null
// 15. test that coordinates are not validated before being written
// 16. test that a db error propagates to the caller

import MapService from "../../../services/map";
import CountryModel from "../../../models/country";
import CardModel from "../../../models/card";

jest.mock("../../../models/country");
jest.mock("../../../models/card");

const realCards = [
  {
    _id: "6811428f9a85ca7a737cb5dc",
    number: 950,
    item: "postcard",
    country: "Netherlands",
    empire: "Dutch",
    imageLinks: [
      {
        _id: "6811428f9a85ca7a737cb5d3",
        name: "950A.jpeg",
        link: "/images/postcards/950A.jpeg",
        size: { width: 0, height: 0 },
        orientation: 1,
        cardNumber: 950,
        __v: 0,
      },
      {
        _id: "6811428f9a85ca7a737cb5d5",
        name: "950B.jpeg",
        link: "/images/postcards/950B.jpeg",
        size: { width: 0, height: 0 },
        orientation: 1,
        cardNumber: 950,
        __v: 0,
      },
    ],
  },
  {
    _id: "681a74d652b0f77b5515c19f",
    number: 951,
    item: "postcard",
    country: "Sweden",
    empire: "Dutch",
    imageLinks: [
      {
        _id: "681a74d652b0f77b5515c197",
        name: "951A.jpeg",
        link: "/images/postcards/951A.jpeg",
        size: { width: 0, height: 0 },
        orientation: 1,
        cardNumber: 951,
        __v: 0,
      },
      {
        _id: "681a74d652b0f77b5515c199",
        name: "951B.jpeg",
        link: "/images/postcards/951B.jpeg",
        size: { width: 0, height: 0 },
        orientation: 1,
        cardNumber: 951,
        __v: 0,
      },
    ],
  },
];

const fakeCountriesDb = [
  { name: "Netherlands", empire: "Dutch" },
  { name: "Sweden", empire: "Dutch" },
];

const validCountry = {
  _id: "69e7b4decaadd2995940977f",
  name: "USA",
  empire: "American",
  coordinates: [344, 242],
  __v: 0,
};

function asMongooseDocs(cards: any[]) {
  return cards.map((card) => ({
    ...card,
    toObject: jest.fn().mockReturnValue(card),
  }));
}

describe("MapService.getCardsByEmpire", () => {
  let mapService: MapService;

  beforeEach(() => {
    mapService = new MapService();
    jest.clearAllMocks();
  });

  it("returns [] without querying anything when empire is empty", async () => {
    const result = await mapService.getCardsByEmpire("");

    expect(result).toEqual([]);
    expect(CountryModel.find).not.toHaveBeenCalled();
    expect(CardModel.find).not.toHaveBeenCalled();
  });

  it("returns real cards for a valid empire (happy path)", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([
      { name: "Netherlands" },
      { name: "Netherlands" },
    ]);
    const populateMock = jest.fn().mockResolvedValue(asMongooseDocs(realCards));
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    const result = await mapService.getCardsByEmpire("Dutch");

    expect(CountryModel.find).toHaveBeenCalledWith({ empire: "Dutch" });
    expect(CardModel.find).toHaveBeenCalledWith(
      {
        $or: [
          { empire: "Dutch" },
          { country: { $in: ["Netherlands", "Netherlands"] } },
        ],
      },
      undefined,
    );
    expect(populateMock).toHaveBeenCalledWith("imageLinks");
    expect(result).toEqual(realCards);
  });

  it("is case sensitive on empire, no normalization happens", async () => {
    (CountryModel.find as jest.Mock).mockImplementation(
      ({ empire }: { empire: string }) =>
        Promise.resolve(fakeCountriesDb.filter((c) => c.empire === empire)),
    );
    const populateMock = jest.fn().mockResolvedValue([]);
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    await mapService.getCardsByEmpire("dutch"); // fakeCountriesDb only has "Dutch"

    expect(CardModel.find).toHaveBeenCalledWith(
      { $or: [{ empire: "dutch" }, { country: { $in: [] } }] },
      undefined,
    );
  });

  it("does not trim whitespace on empire", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([]);
    const populateMock = jest.fn().mockResolvedValue([]);
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    await mapService.getCardsByEmpire("Dutch ");

    expect(CountryModel.find).toHaveBeenCalledWith({ empire: "Dutch " });
  });

  it("queries with an empty country list when the empire has no matching countries", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([]);
    const populateMock = jest.fn().mockResolvedValue([]);
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    await mapService.getCardsByEmpire("British");

    expect(CardModel.find).toHaveBeenCalledWith(
      { $or: [{ empire: "British" }, { country: { $in: [] } }] },
      undefined,
    );
  });

  it("passes a projection through untouched when provided", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([]);
    const populateMock = jest.fn().mockResolvedValue([]);
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    const projection: Record<string, 0 | 1> = {
      _id: 1,
      number: 1,
      item: 1,
      empire: 1,
      country: 1,
      imageLinks: 1,
      originalLocation: 1,
      postLocation: 1,
    };
    await mapService.getCardsByEmpire("Dutch", projection);

    expect(CardModel.find).toHaveBeenCalledWith(expect.anything(), projection);
  });

  it("defaults projection to undefined when omitted", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([]);
    const populateMock = jest.fn().mockResolvedValue([]);
    (CardModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    await mapService.getCardsByEmpire("Dutch");

    expect(CardModel.find).toHaveBeenCalledWith(expect.anything(), undefined);
  });
});

describe("MapService.getCountries", () => {
  let mapService: MapService;

  beforeEach(() => {
    mapService = new MapService();
    jest.clearAllMocks();
  });

  it("filters by empire when one is given", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([validCountry]);

    await mapService.getCountries("American");

    expect(CountryModel.find).toHaveBeenCalledWith({ empire: "American" });
  });

  it("queries every country when no empire is given", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue(fakeCountriesDb);

    await mapService.getCountries();

    expect(CountryModel.find).toHaveBeenCalledWith({});
  });

  it("treats an empty-string empire as no filter at all", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue(fakeCountriesDb);

    await mapService.getCountries("");

    expect(CountryModel.find).toHaveBeenCalledWith({});
  });

  it("returns exactly what the model returns, with no reshaping", async () => {
    (CountryModel.find as jest.Mock).mockResolvedValue([validCountry]);

    const result = await mapService.getCountries("American");

    expect(result).toEqual([validCountry]);
  });

  it("propagates a db error to the caller", async () => {
    (CountryModel.find as jest.Mock).mockRejectedValue(new Error("db down"));

    await expect(mapService.getCountries("American")).rejects.toThrow(
      "db down",
    );
  });
});

describe("MapService.updateCountryCoordinates", () => {
  let mapService: MapService;

  beforeEach(() => {
    mapService = new MapService();
    jest.clearAllMocks();
  });

  it("writes the coordinates and returns the updated country", async () => {
    (CountryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      validCountry,
    );

    const result = await mapService.updateCountryCoordinates(
      "69e7b4decaadd2995940977f",
      [344, 242],
    );

    expect(CountryModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "69e7b4decaadd2995940977f",
      { coordinates: [344, 242] },
      { new: true },
    );
    expect(result).toEqual(validCountry);
  });

  it("returns null when no country matches the id", async () => {
    (CountryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await mapService.updateCountryCoordinates(
      "000000000000000000000000",
      [1, 2],
    );

    expect(result).toBeNull();
  });

  it("does not validate coordinates before writing them", async () => {
    (CountryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      validCountry,
    );

    // empty, wrong-length and non-numeric all go straight to the db as-is
    await mapService.updateCountryCoordinates("abc123", []);
    await mapService.updateCountryCoordinates("abc123", [1, 2, 3]);
    await mapService.updateCountryCoordinates("abc123", [
      "a",
      "b",
    ] as unknown as number[]);

    expect(CountryModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
      1,
      "abc123",
      { coordinates: [] },
      { new: true },
    );
    expect(CountryModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
      2,
      "abc123",
      { coordinates: [1, 2, 3] },
      { new: true },
    );
    expect(CountryModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
      3,
      "abc123",
      { coordinates: ["a", "b"] },
      { new: true },
    );
  });

  it("propagates a db error (e.g. a CastError on a malformed id) to the caller", async () => {
    (CountryModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error("CastError"),
    );

    await expect(
      mapService.updateCountryCoordinates("not-a-valid-id", [1, 2]),
    ).rejects.toThrow("CastError");
  });
});
