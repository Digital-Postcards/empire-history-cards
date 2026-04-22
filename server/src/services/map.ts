import CardModel from "../models/card";
import CountryModel from "../models/country";
import CardService from "./card";

export default class MapService extends CardService {
  public async getCardsByEmpire(empire: string, projection?: any) {
    if (!empire) return [];
    const empireCountries = await CountryModel.find({ empire });
    const countryNames = empireCountries.map((c) => c.name);

    const cards = await CardModel.find(
      {
        $or: [{ empire: empire }, { country: { $in: countryNames } }],
      },
      projection,
    ).populate("imageLinks");

    return cards.map((card: any) => card.toObject());
  }
}
