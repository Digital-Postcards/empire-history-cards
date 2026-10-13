import CardModel from "../models/card";
import CountryModel from "../models/country";

export default class MapService {
  public async getCardsByEmpire(
    empire: string,
    projection?: Record<string, 0 | 1>,
  ) {
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

  /**
   * All countries, optionally narrowed to a single empire.
   * An absent or empty empire returns every country.
   */
  public async getCountries(empire?: string) {
    const filter = empire ? { empire } : {};
    return CountryModel.find(filter);
  }

  /**
   * Persist a country's new map coordinates after a drag.
   * Returns null when no country matches the id.
   */
  public async updateCountryCoordinates(id: string, coordinates: number[]) {
    return CountryModel.findByIdAndUpdate(id, { coordinates }, { new: true });
  }
}
