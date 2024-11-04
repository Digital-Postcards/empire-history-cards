import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ICard } from './Cards'; 
import { IImage } from './Images';  
import e from 'express';


class ITag {
  @prop({ required: true, unique: true })
  public name!: string; 

  @prop({ default: 0 })
  public numberOfCards!: number;  // The number of cards associated with this tag
}

const TagModel = getModelForClass(ITag);
export default TagModel;
export { ITag };
