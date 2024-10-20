import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ICard } from './Cards';  // Import the named export ICard
import { IImage } from './Images';  // Import the IImage class for referencing images

// Define the Tag model with Typegoose decorators
class Tag {
  @prop({ required: true, unique: true })
  public name!: string;  // Tag name (e.g., "Hand Tinted")

  @prop({ ref: () => ICard })
  public cards!: Ref<ICard>[];  // Array of card numbers associated with this tag

  @prop({ ref: () => IImage })  // Reference the IImage class
  public images!: Ref<IImage>[];  // Array of ObjectIDs referencing the images associated with this tag

  @prop({ default: 0 })
  public numberOfCards!: number;  // The number of cards associated with this tag
}

// Create a Typegoose model for Tag
const TagModel = getModelForClass(Tag);
export default TagModel;
