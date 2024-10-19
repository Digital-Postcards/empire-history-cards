import { getModelForClass, prop } from '@typegoose/typegoose';
import 'reflect-metadata';
import { IImage } from './Images'; 

// Define the ICard class with Typegoose decorators
class ICard {
  @prop({ required: true, unique: true })
  public number!: number;

  @prop()
  public item?: string;

  @prop()
  public date?: string;

  @prop()
  public postmarked?: string;

  @prop()
  public place?: string;

  @prop()
  public company?: string;

  @prop()
  public companyInformation?: string;

  @prop()
  public description?: string;

  @prop()
  public analysis?: string;

  @prop()
  public message?: string;

  @prop({ type: () => [IImage], _id: false })  // Prevents _id for embedded documents
  public images?: IImage[];
}

export { ICard }; 

// Create a Typegoose model for ICard
const CardModel = getModelForClass(ICard);
export default CardModel;