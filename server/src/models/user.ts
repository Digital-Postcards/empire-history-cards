import { getModelForClass, prop } from "@typegoose/typegoose";

export class IUser {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public firstname?: string;

  @prop()
  public lastname?: string;
}

const UserModel = getModelForClass(IUser);
export default UserModel;
