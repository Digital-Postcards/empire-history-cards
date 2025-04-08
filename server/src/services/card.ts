import CardModel from "../models/card";
import ImageModel from "../models/image";
import TagModel from "../models/tag";

export default class CardService {
  public async getCardsByFilter(query: any, projection?: any) {
    const {
      type,
      year,
      withTags,
      isInScrapbook,
      originalLocation,
      page = 1,
      limit = 20,
      isPopulate = true,
    } = query;
    const _query: any = {};

    if (type) _query.item = type;
    if (year) _query.date = { $regex: year };
    if (isInScrapbook) _query.isInScrapbook = isInScrapbook;
    if (originalLocation) _query.originalLocation = originalLocation;

    let cards;
    if (withTags) {
      // Handle theme filtering using aggregation pipeline
      const themeNames = Array.isArray(withTags) ? withTags : [withTags];
      const themeNamesDecoded = themeNames.map((name) =>
        decodeURIComponent(name)
      );

      // First, find the theme IDs for the given names
      const themes = await TagModel.find({ name: { $in: themeNamesDecoded } });
      const themeIds = themes.map((theme) => theme._id);

      // Then find cards that have all the specified themes
      _query.themes = { $all: themeIds };

      if (!isPopulate) {
        cards = await CardModel.find(_query, projection);
      } else {
        cards = await CardModel.find(_query, projection).populate(
          "themes imageLinks"
        );
      }
    } else {
      // Regular query without theme filtering
      if (!isPopulate) {
        cards = await CardModel.find(_query, projection);
      } else {
        cards = await CardModel.find(_query, projection).populate(
          "themes imageLinks"
        );
      }
    }

    if (isInScrapbook) {
      let cardsForScrapBook: any = [];
      cards.forEach((card: any) => {
        cardsForScrapBook.push({
          _id: card._id,
          item: card.item,
          description: card.description.slice(0, 300).trim() + "...",
          themes: card.themes.map((theme: any) => theme.name),
          image: "/public" + card.imageLinks[0].link,
        });
      });
      return cardsForScrapBook;
    }

    return cards.map((card: any) => ({
      ...card._doc,
      themes: card._doc.themes.map((item: any) => item.name),
    }));
  }

  public async getCardById(id: string) {
    const card: any = await CardModel.findById(id).populate(
      "themes imageLinks"
    );
    if (card)
      return {
        ...card._doc,
        themes: card._doc.themes.map((item: any) => {
          return item.name;
        }),
      };
    else return null;
  }

  public async uploadCard(body: any, files: any) {
    try {
      const cardData = JSON.parse(body.cardData);
      const uploadedFiles = files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // 1. Create image entries
      const imageLinks = [];
      for (const [fieldname, fileArray] of Object.entries(uploadedFiles)) {
        for (const file of fileArray) {
          // Create image entry
          const image = new ImageModel({
            name: file.originalname,
            link: file.path.replace(process.env.IMAGES_DIR || "", "/images"),
            size: {
              width: 0, // TODO: Get actual image dimensions
              height: 0,
            },
            orientation: 1,
            cardNumber: cardData.number.toString(),
          });
          const savedImage = await image.save();
          imageLinks.push(savedImage._id);
        }
      }

      // 2. Create or update theme entries
      const themeIds = [];
      for (const themeName of cardData.themes) {
        let theme = await TagModel.findOne({ name: themeName });
        if (!theme) {
          theme = new TagModel({
            name: themeName,
            numberOfCards: 1,
          });
        } else {
          theme.numberOfCards += 1;
        }
        const savedTheme = await theme.save();
        themeIds.push(savedTheme._id);
      }

      // 3. Create card entry
      const card = new CardModel({
        number: cardData.number,
        item: cardData.item,
        date: cardData.date,
        postmarked: cardData.postmarked,
        place: cardData.place,
        company: cardData.company,
        companyInformation: cardData.companyInformation,
        description: cardData.description,
        analysis: cardData.analysis,
        message: cardData.message,
        isBlurByDefault: cardData.isBlurByDefault,
        isInScrapbook: cardData.isInScrapbook,
        imageLinks: imageLinks,
        themes: themeIds,
      });

      const savedCard = await card.save();

      return {
        message: "Card and associated data saved successfully",
        card: savedCard,
      };
    } catch (error) {
      console.error("Error in uploadCard:", error);
      throw error;
    }
  }
}
