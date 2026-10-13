// unit tests for CardController
//
// No spies. CardService is module-mocked and backed by a small in-memory
// store, so every assertion is toEqual on res.statusCode / res.body or on
// what actually ended up in that store.
//
// getPaginatedCards
//  1. returns the cards the service produced with 200
//  2. forwards the whole query string to the service, unexamined
//  3. returns 400 with the error message when the service throws
// getCardByID
//  4. returns the card with 200
//  5. returns 404 when the card doesn't exist
//  6. returns 400 when the service throws
// getCardsForScrapbook
//  7. returns the scrapbook cards with 200
//  8. returns 400 when the service throws
// uploadCard
//  9. returns 201 with the service's result, and the card is stored
// 10. returns 400 when cardData isn't valid JSON, without reaching the service
// 11. returns 400 when the service throws
// updateCard
// 12. returns 200 with the updated card, and the store really changed
// 13. returns 404 when the card doesn't exist
// 14. returns 400 when the service throws
// deleteCard
// 15. returns 200 and the card is gone from the store
// 16. returns 404 when the card doesn't exist
// 17. returns 400 when the service throws

import { Request } from "express";
import { CardController } from "../../../controllers/cardController";
import { CardService } from "../../../services";
import { mockRes } from "../../helpers/mockRes";

jest.mock("../../../services/card");

let cardsDb: any[];
let uploadedCards: any[];

function freshCards() {
  return [
    { _id: "card1", item: "postcard", number: 1000, themes: ["Racism"] },
    { _id: "card2", item: "tradecard", number: 1001, themes: [] },
  ];
}

function installCardServiceFake() {
  cardsDb = freshCards();
  uploadedCards = [];
  const svc = CardService.prototype as any;

  svc.getCardsByFilter.mockImplementation(async (query: any) =>
    query?.type ? cardsDb.filter((c) => c.item === query.type) : cardsDb,
  );

  svc.getScrapbookCards.mockImplementation(async () =>
    cardsDb.map((c) => ({ _id: c._id, item: c.item, image: "", themes: [] })),
  );

  svc.getCardById.mockImplementation(
    async (id: string) => cardsDb.find((c) => c._id === id) ?? null,
  );

  svc.uploadCard.mockImplementation(async (body: any) => {
    const data = JSON.parse(body.cardData);
    const saved = { ...data, _id: `card${cardsDb.length + 1}` };
    cardsDb.push(saved);
    uploadedCards.push(saved);
    return {
      message: "Card and associated data saved successfully",
      card: saved,
    };
  });

  svc.updateCard.mockImplementation(async (id: string, data: any) => {
    const card = cardsDb.find((c) => c._id === id);
    if (!card) return null;
    Object.assign(card, data);
    return card;
  });

  svc.deleteCard.mockImplementation(async (id: string) => {
    const index = cardsDb.findIndex((c) => c._id === id);
    if (index < 0) return null;
    cardsDb.splice(index, 1);
    return true;
  });
}

describe("CardController", () => {
  let controller: CardController;

  beforeEach(() => {
    jest.clearAllMocks();
    installCardServiceFake();
    controller = new CardController();
  });

  describe("getPaginatedCards", () => {
    it("returns the cards the service produced with 200", async () => {
      const req = { query: {} } as any;
      const res = mockRes();

      await controller.getPaginatedCards(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(cardsDb);
    });

    it("forwards the whole query string to the service, unexamined", async () => {
      const req = { query: { type: "postcard" } } as any;
      const res = mockRes();

      await controller.getPaginatedCards(req, res, jest.fn());

      expect(res.body).toEqual([cardsDb[0]]);
    });

    it("returns 400 with the error message when the service throws", async () => {
      (CardService.prototype as any).getCardsByFilter.mockRejectedValue(
        new Error("bad filter"),
      );
      const req = { query: {} } as any;
      const res = mockRes();

      await controller.getPaginatedCards(req, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "bad filter" });
    });
  });

  describe("getCardByID", () => {
    it("returns the card with 200", async () => {
      const req = { params: { id: "card1" } } as any;
      const res = mockRes();

      await controller.getCardByID(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(cardsDb[0]);
    });

    it("returns 404 when the card doesn't exist", async () => {
      const req = { params: { id: "nope" } } as any;
      const res = mockRes();

      await controller.getCardByID(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Card not found" });
    });

    it("returns 400 when the service throws", async () => {
      (CardService.prototype as any).getCardById.mockRejectedValue(
        new Error("db down"),
      );
      const req = { params: { id: "card1" } } as any;
      const res = mockRes();

      await controller.getCardByID(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "db down" });
    });
  });

  describe("getCardsForScrapbook", () => {
    it("returns the scrapbook cards with 200", async () => {
      const res = mockRes();

      await controller.getCardsForScrapbook({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { _id: "card1", item: "postcard", image: "", themes: [] },
        { _id: "card2", item: "tradecard", image: "", themes: [] },
      ]);
    });

    it("returns 400 when the service throws", async () => {
      (CardService.prototype as any).getScrapbookCards.mockRejectedValue(
        new Error("db down"),
      );
      const res = mockRes();

      await controller.getCardsForScrapbook({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "db down" });
    });
  });

  describe("uploadCard", () => {
    const uploadReq = (cardData: string) =>
      ({
        body: { cardData },
        files: {
          frontImage: [
            {
              originalname: "a.jpg",
              path: "/tmp/a.jpg",
              size: 1,
              mimetype: "image/jpeg",
            },
          ],
        },
      }) as any;

    it("returns 201 with the service's result, and the card is stored", async () => {
      const res = mockRes();

      await controller.uploadCard(
        uploadReq(
          JSON.stringify({ number: 1002, item: "postcard", themes: [] }),
        ),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: "Card and associated data saved successfully",
        card: { _id: "card3", number: 1002, item: "postcard", themes: [] },
      });
      expect(uploadedCards).toHaveLength(1);
    });

    it("returns 400 when cardData isn't valid JSON, without reaching the service", async () => {
      const res = mockRes();

      await controller.uploadCard(uploadReq("not json"), res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(uploadedCards).toEqual([]);
    });

    it("returns 400 when the service throws", async () => {
      (CardService.prototype as any).uploadCard.mockRejectedValue(
        new Error("save failed"),
      );
      const res = mockRes();

      await controller.uploadCard(
        uploadReq(JSON.stringify({ number: 1002, themes: [] })),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "save failed" });
    });
  });

  describe("updateCard", () => {
    it("returns 200 with the updated card, and the store really changed", async () => {
      const req = {
        params: { id: "card1" },
        body: { item: "tradecard" },
      } as any;
      const res = mockRes();

      await controller.updateCard(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "Card updated successfully",
        card: cardsDb[0],
      });
      expect(cardsDb[0].item).toEqual("tradecard");
    });

    it("returns 404 when the card doesn't exist", async () => {
      const req = {
        params: { id: "dummy" },
        body: { item: "tradecard" },
      } as any;
      const res = mockRes();

      await controller.updateCard(req, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Card not found" });
    });

    it("returns 400 when the service throws", async () => {
      (CardService.prototype as any).updateCard.mockRejectedValue(
        new Error("db down"),
      );
      const req = {
        params: { id: "card1" },
        body: {},
      } as any;
      const res = mockRes();

      await controller.updateCard(req, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "db down" });
    });
  });

  describe("deleteCard", () => {
    it("returns 200 and the card is gone from the store", async () => {
      const req = { params: { id: "card1" } } as any;
      const res = mockRes();

      await controller.deleteCard(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "Card deleted successfully" });
      expect(cardsDb.map((c) => c._id)).toEqual(["card2"]);
    });

    it("returns 404 when the card doesn't exist", async () => {
      const req = { params: { id: "dummy" } } as any;
      const res = mockRes();

      await controller.deleteCard(req, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Card not found" });
      expect(cardsDb).toHaveLength(2);
    });

    it("returns 400 when the service throws", async () => {
      (CardService.prototype as any).deleteCard.mockRejectedValue(
        new Error("db down"),
      );
      const req = { params: { id: "card1" } } as any;
      const res = mockRes();

      await controller.deleteCard(req, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "db down" });
    });
  });
});
