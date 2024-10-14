import { getModelForClass, prop } from '@typegoose/typegoose';
import 'reflect-metadata';

// Define a separate class for Size
class Size {
	@prop()
	public width?: number;
  
	@prop()
	public height?: number;
  }
  
  // Define the IImage class with Typegoose decorators
  class IImage {
	@prop({ required: true })
	public name!: string;
  
	@prop({ required: true })
	public link!: string;
  
	// Use the `Size` class for the nested object
	@prop({ _id: false })  // Prevents _id for subdocument
	public size?: Size;
  
	@prop()
	public orientation?: string;
  
	@prop({ required: true })
	public cardNumber!: number;
  }
  
  // Create a Typegoose model for IImage
  const ImageModel = getModelForClass(IImage);
  export default ImageModel;
  export { IImage }; 