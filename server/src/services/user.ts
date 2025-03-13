import UserModel, { IUser } from "../models/user";

export default class UserService {
  public async getUserDetails(email: string): Promise<any> {
    return await UserModel.findOne({ email: email });
  }
}
