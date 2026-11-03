const request = require("supertest");
import fs from "fs";
import path from "path";
import app from "../..";
import { generateTestToken, authCookie } from "../helpers/jwt";
import CardService from "../../services/card";

// Only the database layer is faked. Multer runs for real and writes into the
// test IMAGES_DIR set in setupEnv.ts, so the tests can check what hit disk.
jest.mock("../../services/card");

const UPLOAD = "/api/cards/upload-card";
const IMAGES_DIR = process.env.IMAGES_DIR as string;
const POSTCARDS_DIR = path.join(IMAGES_DIR, "postcards");
// where the ../ payloads below land: the folder that contains IMAGES_DIR
const OUTSIDE_DIR = path.dirname(IMAGES_DIR);

const cookie = authCookie(
  generateTestToken({ userId: "507f191e810c19729de860ea", userRole: "manager" }),
);

// JFIF header, so these pass a magic-byte check if one is added later
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

const cardData = (number: number | string, item = "postcard") =>
  JSON.stringify({ number, item, themes: [] });

// every path a test below might write to, removed after each test
const written = [
  path.join(POSTCARDS_DIR, "9999A.html"),
  path.join(POSTCARDS_DIR, "9998A.jpg"),
  path.join(POSTCARDS_DIR, "9997A.jpg"),
  path.join(OUTSIDE_DIR, "escaped-by-numberA.jpg"),
  path.join(OUTSIDE_DIR, "escaped-by-items"),
];

afterEach(() => {
  jest.clearAllMocks();
  // cleanup turned off for now so the uploaded files stay on disk as proof
  // for (const p of written) fs.rmSync(p, { recursive: true, force: true });
});

describe("upload-card: file type check", () => {
  it("rejects an .html file sent with an image/jpeg content type", async () => {
    const res = await request(app)
      .post(UPLOAD)
      .set("Cookie", [cookie])
      .field("cardData", cardData(9999))
      .attach("frontImage", Buffer.from("<script>alert(1)</script>"), {
        filename: "test.html",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(400);
    expect(fs.existsSync(path.join(POSTCARDS_DIR, "9999A.html"))).toBe(false);
  });
});

describe("upload-card: filename sanitization", () => {
  it("strips ../ from the uploaded filename", async () => {
    const res = await request(app)
      .post(UPLOAD)
      .set("Cookie", [cookie])
      .field("cardData", cardData(9998))
      .attach("frontImage", JPEG, {
        filename: "../../etc/passwd.jpg",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(201);
    expect(fs.existsSync(path.join(POSTCARDS_DIR, "9998A.jpg"))).toBe(true);

    // originalname is what CardService saves as the image name
    const files = (CardService.prototype.uploadCard as jest.Mock).mock.calls[0][1];
    expect(files.frontImage[0].originalname).toBe("passwd.jpg");
  });

  it("does not let cardData.number write a file outside IMAGES_DIR", async () => {
    const res = await request(app)
      .post(UPLOAD)
      .set("Cookie", [cookie])
      .field("cardData", cardData("../../escaped-by-number"))
      .attach("frontImage", JPEG, {
        filename: "card.jpg",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(400);
    expect(fs.existsSync(path.join(OUTSIDE_DIR, "escaped-by-numberA.jpg"))).toBe(false);
  });

  it("does not let cardData.item create a folder outside IMAGES_DIR", async () => {
    const res = await request(app)
      .post(UPLOAD)
      .set("Cookie", [cookie])
      .field("cardData", cardData(9996, "../escaped-by-item"))
      .attach("frontImage", JPEG, {
        filename: "card.jpg",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(400);
    expect(fs.existsSync(path.join(OUTSIDE_DIR, "escaped-by-items"))).toBe(false);
  });
});

describe("upload-card: upload size", () => {
  it("rejects a 60MB image", async () => {
    const res = await request(app)
      .post(UPLOAD)
      .set("Cookie", [cookie])
      .field("cardData", cardData(9997))
      .attach("frontImage", Buffer.alloc(60 * 1024 * 1024), {
        filename: "big.jpg",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(413);
    expect(fs.existsSync(path.join(POSTCARDS_DIR, "9997A.jpg"))).toBe(false);
  }, 30000);
});
