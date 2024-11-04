import { getModelForClass, prop } from '@typegoose/typegoose';

class ITag {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ default: 0 })
  public numberOfCards!: number;  // The number of cards associated with this tag
}

const TagModel = getModelForClass(ITag);
export default TagModel;
export { ITag };
