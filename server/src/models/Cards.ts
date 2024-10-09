import { Schema, model, Document } from 'mongoose';

export interface ICard extends Document {
  number: string;
  item: string;
  date: string;
  place: string;
  postmarked: string;
  company: string;
  companyInformation: string;
  description: string;
  analysis: string;
  message: string;
  imageLinks: string[]; 
}

const cardSchema = new Schema<ICard>({
  number: { type: String, unique: true  },
  item: { type: String},
  date: { type: String},
  postmarked: { type: String},
  place: { type: String},
  company: { type: String},
  companyInformation: { type: String},
  description: { type: String},
  analysis: { type: String},
  message: { type: String},
  imageLinks: [{ type: String }]
});

// Create and export the Postcard model
const Cards = model<ICard>('Cards', cardSchema);

export default Cards;
