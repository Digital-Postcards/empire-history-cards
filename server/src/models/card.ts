import { getModelForClass, prop, PropType, Ref } from '@typegoose/typegoose';
import { IImage } from './image';
import { ITag } from './tag';

class Coordinates {
	@prop()
	public latitude?: number;

	@prop()
	public longitude?: number;
}

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
  public country?: string;

  @prop()
  public empire?: string;

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
  public originalLocation?: Coordinates;

  @prop()
  public postLocation?: Coordinates;

  @prop()
  public destinationLocation?: Coordinates;

  @prop({ ref: () => ITag }, PropType.ARRAY)
  public themes?: Ref<ITag>[];

  @prop({ default: false })
  public isInScrapbook?: boolean;

  @prop({ default: false })
  public isBlurByDefault?: boolean;
}

const CardModel = getModelForClass(ICard);
export default CardModel;