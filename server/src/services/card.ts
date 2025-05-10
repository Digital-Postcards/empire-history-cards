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
        for (const [index, file] of fileArray.entries()) {
          // Get the rotation value from the corresponding form field
          let orientation = 1; // Default value
          
          // Extract the orientation from the request body
          let rotationFieldName = '';
          
          // Handle different file field naming patterns
          if (fieldname === 'frontImage' || fieldname === 'backImage') {
            rotationFieldName = `${fieldname}Rotation`;
          } else if (fieldname.startsWith('additionalImage-')) {
            // For additional images which use indexed fields
            rotationFieldName = `${fieldname}Rotation`;
          }
          
          if (body[rotationFieldName]) {
            orientation = parseInt(body[rotationFieldName], 10);
          }
          
          console.log(`Image ${fieldname} orientation: ${orientation}`);
          
          // Create image entry with the correct orientation
          const image = new ImageModel({
            name: file.originalname,
            link: file.path.replace(process.env.IMAGES_DIR || "", "/images"),
            size: {
              width: 0, // TODO: Get actual image dimensions
              height: 0,
            },
            orientation: orientation, // Use the orientation value from the frontend
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
        country: cardData.country,
        empire: cardData.empire,
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

  public async updateCard(cardId: string, updateData: any) {
    try {
      // Process themes if they're being updated
      if (updateData.themes && updateData.themes.length > 0) {
        const themeIds = [];
        for (const themeName of updateData.themes) {
          let theme = await TagModel.findOne({ name: themeName });
          if (!theme) {
            // Create new theme if it doesn't exist
            theme = new TagModel({
              name: themeName,
              numberOfCards: 1,
            });
          }
          const savedTheme = await theme.save();
          themeIds.push(savedTheme._id);
        }
        updateData.themes = themeIds;
      }

      // Update card and return the updated document
      const updatedCard = await CardModel.findByIdAndUpdate(
        cardId,
        updateData,
        { new: true }
      ).populate('themes imageLinks');

      if (!updatedCard) {
        return null;
      }

      // Convert to plain JavaScript object to avoid TypeScript errors
      const cardObject = updatedCard.toObject();
      
      // Format the card data to match the expected format in the frontend
      return {
        ...cardObject,
        themes: cardObject.themes && Array.isArray(cardObject.themes)
          ? cardObject.themes.map((theme: any) => {
              return typeof theme === 'string' ? theme : theme.name;
            })
          : [],
      };
    } catch (error) {
      console.error("Error in updateCard:", error);
      throw error;
    }
  }

  public async deleteCard(cardId: string) {
    try {
      // First get the card to retrieve theme and image IDs
      const card = await CardModel.findById(cardId);
      if (!card) {
        return null;
      }

      // Delete the card
      const deleteResult = await CardModel.deleteOne({ _id: cardId });

      // Update theme counts or delete themes if no longer used
      if (card.themes && card.themes.length > 0) {
        for (const themeId of card.themes) {
          const theme = await TagModel.findById(themeId);
          if (theme) {
            if (theme.numberOfCards <= 1) {
              // Delete theme if this was the only card using it
              await TagModel.deleteOne({ _id: themeId });
            } else {
              // Decrement the numberOfCards for the theme
              theme.numberOfCards -= 1;
              await theme.save();
            }
          }
        }
      }

      // Delete associated images (optional, can be commented out if you want to keep images)
      if (card.imageLinks && card.imageLinks.length > 0) {
        await ImageModel.deleteMany({ _id: { $in: card.imageLinks } });
      }

      return deleteResult.deletedCount > 0;
    } catch (error) {
      console.error("Error in deleteCard:", error);
      throw error;
    }
  }
}
