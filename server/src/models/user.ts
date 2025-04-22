import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

// Define the possible user roles
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  MANAGER = "manager"
}

export class IUser {
  // Add _id property which is automatically created by MongoDB
  _id?: Types.ObjectId;
  
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public firstname?: string;

  @prop()
  public lastname?: string;
  
  @prop({ enum: UserRole, default: UserRole.MANAGER })
  public role?: string;
  
  @prop({ default: Date.now })
  public lastLogin?: Date;

  @prop({ default: Date.now })
  public createdAt?: Date;
  
  @prop()
  public profilePictureUrl?: string;
}

const UserModel = getModelForClass(IUser);
export default UserModel;
