import CardModel from "../models/card";

export default class CardService {
    public async getCardsByFilter(query: any, projection?: any) {
        const { type, year, withTags, isInScrapbook, originalLocation, page = 1, limit = 20, isPopulate = true } = query;
        const _query: any = {};

        if (type) _query.item = type;
        if (year) _query.date = { $regex: year };
        if (isInScrapbook) _query.isInScrapbook = isInScrapbook;
        if (originalLocation) _query.originalLocation = originalLocation;

        let cards;
        if (!isPopulate) {
            cards = await CardModel.find(_query, projection)
                .skip((+page - 1) * +limit)
                .limit(+limit)
        } else {
            cards = await CardModel.find(_query, projection)
                .skip((+page - 1) * +limit)
                .limit(+limit)
                .populate("themes imageLinks");
        }

        if (isInScrapbook) {
            let cardsForScrapBook: any = [];
            cards.forEach((card: any) => {
                cardsForScrapBook.push({
                    _id: card._id,
                    description: card.description.slice(0, 300) + "...",
                    themes: card.themes.map((theme: any) => {
                        return theme.name
                    }),
                    image: card.imageLinks[0]
                });
            });
            return cardsForScrapBook;
        }

        if (withTags) {
            let tagsToFilter = withTags[0].split(",");
            let filteredCards = cards.filter((card: any) => {
                let themes = card.themes.map((theme: any) => { return theme.name });
                return themes.some((theme: string) => tagsToFilter.includes(theme))
            });
            return filteredCards;
        }

        return cards;
    }

    public async getCardById(id: string) {
        return await CardModel.findById(id).populate("themes imageLinks");
    }
}

