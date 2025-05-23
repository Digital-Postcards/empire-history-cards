import { getModelForClass, prop } from '@typegoose/typegoose';

class Size {
	@prop()
	public width?: number;

	@prop()
	public height?: number;
}

class IImage {
	@prop({ required: true })
	public name!: string;

	@prop({ required: true })
	public link!: string;

	@prop({ _id: false })
	public size?: Size;

	@prop({ required: true, default: 1 })
	public orientation!: number;

	@prop({ required: true })
	public cardNumber!: number;
}


const ImageModel = getModelForClass(IImage);
export default ImageModel;
export { IImage };