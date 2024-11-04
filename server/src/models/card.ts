import { getModelForClass, prop } from '@typegoose/typegoose';
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

  @prop({ type: () => [IImage], _id: false })
  public images?: IImage[];

  @prop({ type: () => Object })
  public originalLocation?: {
    latitude: number;
    longitude: number;
  };

  @prop({ type: () => Object })
  public postCoordinates?: {
    latitude: number;
    longitude: number;
  };

  @prop({ type: () => Object })
  public destinationCoordinates?: {
    latitude: number;
    longitude: number;
  };

  @prop({ type: () => [ITag], _id: false })
  public tags?: ITag[];

  @prop({ default: false })
  public isInScrapbook?: boolean;

  @prop({ default: false })
  public isBlurByDefault?: boolean;
}

export { ICard };

const CardModel = getModelForClass(ICard);
export default CardModel;