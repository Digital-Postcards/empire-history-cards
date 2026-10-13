// unit test for ThemeService.getAllThemes
// mocks TagModel.find().sort(...) directly
// 1. test that themes are returned sorted by numberOfCards descending
// 2. test that an empty result is handled fine
// 3. test that a query error propagates up (the service does not catch it)

import ThemeService from "../../../services/theme";
import TagModel from "../../../models/tag";

jest.mock("../../../models/tag");

const fakeThemes = [
  { name: "Domestic Labor", numberOfCards: 12 },
  { name: "Racial Caricature", numberOfCards: 8 },
];

describe("ThemeService.getAllThemes", () => {
  let themeService: ThemeService;

  beforeEach(() => {
    themeService = new ThemeService();
    jest.clearAllMocks();
  });

  it("returns themes sorted by numberOfCards descending", async () => {
    const sortMock = jest.fn().mockResolvedValue(fakeThemes);
    jest.mocked(TagModel.find).mockReturnValue({ sort: sortMock } as any);

    const result = await themeService.getAllThemes();

    expect(TagModel.find).toHaveBeenCalledWith();
    expect(sortMock).toHaveBeenCalledWith("-numberOfCards");
    expect(result).toEqual(fakeThemes);
  });

  it("returns an empty array when there are no themes", async () => {
    const sortMock = jest.fn().mockResolvedValue([]);
    jest.mocked(TagModel.find).mockReturnValue({ sort: sortMock } as any);

    const result = await themeService.getAllThemes();

    expect(result).toEqual([]);
  });

  it("propagates an error when the query fails", async () => {
    const sortMock = jest.fn().mockRejectedValue(new Error("db down"));
    jest.mocked(TagModel.find).mockReturnValue({ sort: sortMock } as any);

    await expect(themeService.getAllThemes()).rejects.toThrow("db down");
  });
});
