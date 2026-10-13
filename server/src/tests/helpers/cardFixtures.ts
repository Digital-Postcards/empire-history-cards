// Shared fixtures and mongo stand-ins for the CardService read tests
// (cardFilter, cardScrapbook, cardById).
//
// Each test file still declares its own jest.mock() for the models -- that call
// is hoisted per file and can't live here. This module only supplies the data
// and fills in what those mocks do, so the three files assert with toEqual on
// real returned values instead of repeating 150 lines of setup.
import CardModel from "../../models/card";
import TagModel from "../../models/tag";

export const RACIST = "6726ed344cdb018008258fc3";
export const US = "6726ed344cdb018008258fc2";

export const tagsDb = [
  { _id: RACIST, name: "Racist Caricature" },
  { _id: US, name: "United States" },
];

export const FRONT = { _id: "img1", link: "/images/postcards/1000A.jpeg" };
export const BACK = { _id: "img2", link: "/images/postcards/1000B.jpeg" };

// The raw documents as mongo stores them: themes are ids, not names.
export const cardsDb = [
  {
    _id: "card1",
    item: "postcard",
    date: "1905",
    isInScrapbook: true,
    description: "L".repeat(450),
    originalLocation: { latitude: 41.87, longitude: -87.62 },
    imageLinks: [BACK, FRONT], // back listed first on purpose
    themes: [RACIST, US],
  },
  {
    _id: "card2",
    item: "postcard",
    date: "1911",
    isInScrapbook: false,
    description: "A short note.",
    originalLocation: { latitude: 51.5, longitude: -0.12 },
    imageLinks: [FRONT],
    themes: [RACIST],
  },
  {
    _id: "card3",
    item: "tradecard",
    date: "illegible",
    isInScrapbook: true,
    description: "",
    originalLocation: { latitude: 48.85, longitude: 2.35 },
    imageLinks: [],
    themes: [],
  },
];

// Just enough of a mongo matcher for the operators CardService builds.
export function matchesFilter(card: any, filter: any): boolean {
  return Object.entries(filter).every(([field, condition]: [string, any]) => {
    const value = card[field];
    if (condition && typeof condition === "object" && "$regex" in condition) {
      return new RegExp(condition.$regex).test(String(value ?? ""));
    }
    if (condition && typeof condition === "object" && "$all" in condition) {
      // mongo matches no documents at all for $all: [], unlike [].every()
      if (condition.$all.length === 0) return false;
      const have = (value ?? []).map(String);
      return condition.$all.every((id: any) => have.includes(String(id)));
    }
    return JSON.stringify(value) === JSON.stringify(condition);
  });
}

// What .populate("themes imageLinks") hands back. A mongoose document exposes
// its fields directly and keeps the raw data on _doc: toScrapbookCard reads the
// former, toCardDto the latter, so the stand-in has to offer both.
export function asPopulatedDoc(card: any) {
  const populated = {
    ...card,
    themes: card.themes.map((id: string) => tagsDb.find((t) => t._id === id)),
  };
  return { ...populated, _doc: populated };
}

// The DTO the full-card methods should produce: themes flattened to names.
export function expectedDto(card: any) {
  return {
    ...card,
    themes: card.themes.map(
      (id: string) => tagsDb.find((t) => t._id === id)?.name,
    ),
  };
}

// Wire the mocked models up to the fixture above. Call from beforeEach.
export function installReadMocks() {
  (CardModel.find as jest.Mock).mockImplementation((filter: any) => ({
    populate: () =>
      Promise.resolve(
        cardsDb.filter((c) => matchesFilter(c, filter)).map(asPopulatedDoc),
      ),
  }));

  (CardModel.findById as jest.Mock).mockImplementation((id: string) => ({
    populate: () => {
      const found = cardsDb.find((c) => c._id === id);
      return Promise.resolve(found ? asPopulatedDoc(found) : null);
    },
  }));

  (TagModel.find as jest.Mock).mockImplementation((query: any) => {
    const names = query?.name?.$in ?? [];
    return Promise.resolve(tagsDb.filter((t) => names.includes(t.name)));
  });
}

// Point CardModel.find at an explicit list, for tests about how a single card
// is mapped rather than about which cards match a filter.
export function givenCards(cards: any[]) {
  (CardModel.find as jest.Mock).mockImplementation(() => ({
    populate: () => Promise.resolve(cards.map(asPopulatedDoc)),
  }));
}
