import TagModel from "../models/tag";

export default class ThemeService {
    public async getAllThemes() {
        return await TagModel.find().sort("-numberOfCards");
    }
}