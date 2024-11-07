import { getModelForClass, prop, PropType, Ref } from '@typegoose/typegoose';
import { IImage } from './image';
import { ITag } from './tag';

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

  @prop({ ref: () => IImage, _id: false }, PropType.ARRAY)
  public imageLinks?: Ref<IImage>[];

  @prop()
  public originalLocation?: {
    latitude: number;
    longitude: number;
  };

  @prop()
  public postLocation?: {
    latitude: number;
    longitude: number;
  };

  @prop()
  public destinationLocation?: {
    latitude: number;
    longitude: number;
  };

  @prop({ ref: () => ITag }, PropType.ARRAY)
  public themes?: Ref<ITag>[];

  @prop({ default: false })
  public isInScrapbook?: boolean;

  @prop({ default: false })
  public isBlurByDefault?: boolean;
}

const CardModel = getModelForClass(ICard);
export default CardModel;