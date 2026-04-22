import { getModelForClass, prop, PropType } from "@typegoose/typegoose";

class ICountry {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public empire!: string;

  @prop({ required: true, type: () => [Number] }, PropType.ARRAY)
  public coordinates!: number[];
}

const CountryModel = getModelForClass(ICountry);
export default CountryModel;
