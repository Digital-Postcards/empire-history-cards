// unit tests for CardService's write methods: uploadCard, updateCard, deleteCard
//
// No spies. The three models are module-mocked and backed by small in-memory
// stores, so a test can assert with toEqual on what ended up saved, updated or
// deleted rather than on which model methods were called.
//
// uploadCard
//  1. saves one image per uploaded file
//  2. rewrites the absolute disk path into a web link
//  3. uses the rotation sent alongside the file
//  4. falls back to orientation 1 when no rotation was sent
//  5. increments numberOfCards on a theme that already exists
//  6. creates a theme that doesn't exist yet, starting at 1
//  7. attaches the new image and theme ids to the saved card
//  8. returns the success message with the saved card
//  9. rethrows when cardData isn't valid JSON
// 10. leaves images and themes behind when saving the card fails
//
// updateCard
// 11. swaps theme names for theme ids before saving
// 12. does NOT increment an existing theme's count (differs from uploadCard)
// 13. returns null when the card doesn't exist
// 14. flattens themes back to names in the response
//
// deleteCard
// 15. returns null when the card doesn't exist
// 16. reports success when a card was removed
// 17. decrements a theme still used by other cards
// 18. removes a theme entirely when this was its last card
// 19. deletes the images belonging to the card

import CardService from "../../../services/card";
import CardModel from "../../../models/card";
import ImageModel from "../../../models/image";
import TagModel from "../../../models/tag";

jest.mock("../../../models/card");
jest.mock("../../../models/image");
jest.mock("../../../models/tag");

const IMAGES_DIR = "/srv/allimages";

let imagesSaved: any[];
let imagesDeleted: any[];
let tagsDb: any[];
let cardsSaved: any[];
let cardsDeleted: string[];

// A stored tag. findOne hands back this same object, so the service mutating
// numberOfCards on it is visible in tagsDb without save() doing anything.
function storedTag(_id: string, name: string, numberOfCards: number) {
  const tag: any = { _id, name, numberOfCards };
  tag.save = async () => tag;
  return tag;
}

const validCardData = {
  number: 1000,
  item: "postcard",
  date: "1905",
  postmarked: "Yes",
  place: "Chicago",
  country: "United States",
  empire: "American",
  company: "Acme",
  companyInformation: "A company",
  description: "A description",
  analysis: "An analysis",
  message: "A message",
  isBlurByDefault: false,
  isInScrapbook: true,
  themes: ["Racist Caricature", "Brand New Theme"],
};

const validFiles = {
  frontImage: [
    {
      originalname: "scan-front.jpg",
      path: `${IMAGES_DIR}/postcards/1000A.jpeg`,
    },
  ],
  backImage: [
    {
      originalname: "scan-back.jpg",
      path: `${IMAGES_DIR}/postcards/1000B.jpeg`,
    },
  ],
};

describe("CardService write methods", () => {
  let service: CardService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.IMAGES_DIR = IMAGES_DIR;
    service = new CardService();

    imagesSaved = [];
    imagesDeleted = [];
    cardsSaved = [];
    cardsDeleted = [];
    tagsDb = [storedTag("tag1", "Racist Caricature", 5)];

    (ImageModel as any as jest.Mock).mockImplementation((doc: any) => ({
      ...doc,
      save: async () => {
        const saved = { ...doc, _id: `img${imagesSaved.length + 1}` };
        imagesSaved.push(saved);
        return saved;
      },
    }));

    (ImageModel.deleteMany as jest.Mock).mockImplementation(async (q: any) => {
      imagesDeleted.push(...q._id.$in);
      return { deletedCount: q._id.$in.length };
    });

    (TagModel as any as jest.Mock).mockImplementation((doc: any) => {
      const tag: any = { ...doc, _id: `tag${tagsDb.length + 1}` };
      tag.save = async () => {
        tagsDb.push(tag);
        return tag;
      };
      return tag;
    });

    (TagModel.findOne as jest.Mock).mockImplementation(
      async ({ name }: any) => tagsDb.find((t) => t.name === name) ?? null,
    );

    (TagModel.findById as jest.Mock).mockImplementation(
      async (id: string) => tagsDb.find((t) => t._id === id) ?? null,
    );

    (TagModel.deleteOne as jest.Mock).mockImplementation(
      async ({ _id }: any) => {
        tagsDb = tagsDb.filter((t) => t._id !== _id);
        return { deletedCount: 1 };
      },
    );

    (CardModel as any as jest.Mock).mockImplementation((doc: any) => {
      const card: any = { ...doc, _id: "newcard" };
      card.save = async () => {
        cardsSaved.push(card);
        return card;
      };
      return card;
    });

    (CardModel.deleteOne as jest.Mock).mockImplementation(
      async ({ _id }: any) => {
        cardsDeleted.push(_id);
        return { deletedCount: 1 };
      },
    );
  });

  describe("uploadCard", () => {
    const body = () => ({
      cardData: JSON.stringify(validCardData),
      frontImageRotation: "3",
    });

    it("saves one image per uploaded file", async () => {
      await service.uploadCard(body(), validFiles);

      expect(imagesSaved.map((i) => i.name)).toEqual([
        "scan-front.jpg",
        "scan-back.jpg",
      ]);
    });

    it("rewrites the absolute disk path into a web link", async () => {
      await service.uploadCard(body(), validFiles);

      expect(imagesSaved.map((i) => i.link)).toEqual([
        "/images/postcards/1000A.jpeg",
        "/images/postcards/1000B.jpeg",
      ]);
    });

    it("uses the rotation sent alongside the file", async () => {
      await service.uploadCard(body(), validFiles);

      expect(imagesSaved[0].orientation).toEqual(3);
    });

    it("falls back to orientation 1 when no rotation was sent", async () => {
      await service.uploadCard(body(), validFiles);

      // only frontImageRotation was provided
      expect(imagesSaved[1].orientation).toEqual(1);
    });

    it("increments numberOfCards on a theme that already exists", async () => {
      await service.uploadCard(body(), validFiles);

      expect(
        tagsDb.find((t) => t.name === "Racist Caricature").numberOfCards,
      ).toEqual(6);
    });

    it("creates a theme that doesn't exist yet, starting at 1", async () => {
      await service.uploadCard(body(), validFiles);

      expect(tagsDb.find((t) => t.name === "Brand New Theme")).toEqual({
        _id: "tag2",
        name: "Brand New Theme",
        numberOfCards: 1,
        save: expect.any(Function),
      });
    });

    it("attaches the new image and theme ids to the saved card", async () => {
      await service.uploadCard(body(), validFiles);

      expect(cardsSaved[0].imageLinks).toEqual(["img1", "img2"]);
      expect(cardsSaved[0].themes).toEqual(["tag1", "tag2"]);
    });

    it("returns the success message with the saved card", async () => {
      const result = await service.uploadCard(body(), validFiles);

      expect(result.message).toEqual(
        "Card and associated data saved successfully",
      );
      expect(result.card).toEqual(cardsSaved[0]);
    });

    it("rethrows when cardData isn't valid JSON", async () => {
      await expect(
        service.uploadCard({ cardData: "not json" }, validFiles),
      ).rejects.toThrow(SyntaxError);
    });
    it("leaves images and themes behind when saving the card fails", async () => {
      (CardModel as any as jest.Mock).mockImplementation(() => ({
        save: async () => {
          throw new Error("card save failed");
        },
      }));

      await expect(service.uploadCard(body(), validFiles)).rejects.toThrow(
        "card save failed",
      );
      expect(tagsDb.find((t) => t.name === "Brand New Theme")).toBeDefined();
      expect(
        tagsDb.find((t) => t.name === "Racist Caricature").numberOfCards,
      ).toEqual(6);
    });
  });

  describe("updateCard", () => {
    function givenUpdatedCard(cardObject: any) {
      (CardModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: () =>
          Promise.resolve(cardObject ? { toObject: () => cardObject } : null),
      }));
    }

    it("swaps theme names for theme ids before saving", async () => {
      let sentUpdate: any;
      (CardModel.findByIdAndUpdate as jest.Mock).mockImplementation(
        (_id: string, update: any) => {
          sentUpdate = update;
          return { populate: () => Promise.resolve({ toObject: () => ({}) }) };
        },
      );

      await service.updateCard("card1", {
        themes: ["Racist Caricature", "Brand New Theme"],
      });

      expect(sentUpdate.themes).toEqual(["tag1", "tag2"]);
    });

    // uploadCard bumps the count for an existing theme; this one doesn't, so
    // numberOfCards drifts downward as cards are edited.
    it("does NOT increment an existing theme's count, unlike uploadCard", async () => {
      givenUpdatedCard({});

      await service.updateCard("card1", { themes: ["Racist Caricature"] });

      expect(
        tagsDb.find((t) => t.name === "Racist Caricature").numberOfCards,
      ).toEqual(5);
    });

    it("returns null when the card doesn't exist", async () => {
      givenUpdatedCard(null);

      const result = await service.updateCard("nope", { item: "postcard" });

      expect(result).toBeNull();
    });

    it("flattens themes back to names in the response", async () => {
      givenUpdatedCard({
        _id: "card1",
        item: "postcard",
        themes: [{ name: "Racist Caricature" }, { name: "United States" }],
      });

      const result = await service.updateCard("card1", { item: "postcard" });

      expect(result).toEqual({
        _id: "card1",
        item: "postcard",
        themes: ["Racist Caricature", "United States"],
      });
    });
  });

  describe("deleteCard", () => {
    function givenStoredCard(card: any) {
      (CardModel.findById as jest.Mock).mockResolvedValue(card);
    }

    it("returns null when the card doesn't exist", async () => {
      givenStoredCard(null);

      const result = await service.deleteCard("nope");

      expect(result).toBeNull();
      expect(cardsDeleted).toEqual([]);
    });

    it("reports success when a card was removed", async () => {
      givenStoredCard({ _id: "card1", themes: [], imageLinks: [] });

      const result = await service.deleteCard("card1");

      expect(result).toEqual(true);
      expect(cardsDeleted).toEqual(["card1"]);
    });

    it("decrements a theme still used by other cards", async () => {
      givenStoredCard({ _id: "card1", themes: ["tag1"], imageLinks: [] });

      await service.deleteCard("card1");

      expect(tagsDb.find((t) => t._id === "tag1").numberOfCards).toEqual(4);
    });

    it("removes a theme entirely when this was its last card", async () => {
      tagsDb = [storedTag("tag1", "Racist Caricature", 1)];
      givenStoredCard({ _id: "card1", themes: ["tag1"], imageLinks: [] });

      await service.deleteCard("card1");

      expect(tagsDb).toEqual([]);
    });

    it("deletes the images belonging to the card", async () => {
      givenStoredCard({
        _id: "card1",
        themes: [],
        imageLinks: ["img1", "img2"],
      });

      await service.deleteCard("card1");

      expect(imagesDeleted).toEqual(["img1", "img2"]);
    });
  });
});
