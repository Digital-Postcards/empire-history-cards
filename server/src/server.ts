import express, { Request, Response } from 'express';
import { connect } from 'mongoose';  // Mongoose is used by Typegoose
import CardModel from './models/card';  // Import the Card model
import TagModel from './models/tag';  // Import the Tag model

// Create Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB using the Mongoose connect function (Typegoose uses Mongoose under the hood)
const mongoURI = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'; 
connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to process tags for a card
async function processTags(tags: string[], cardId: string) {
  for (const tagName of tags) {
    // Find the tag by name or create a new one
    const tag = await TagModel.findOneAndUpdate(
      { name: tagName },
      { $addToSet: { cards: cardId } },  // Add the card's ObjectID to the tag
      { new: true, upsert: true }  // Create a new tag if it doesn't exist
    );

    await tag.save();
  }
}

// POST route to create or update a postcard and handle associated tags
app.post('/api/postcards', async (req: Request, res: Response) => {
  console.log("POST /api/postcards hit with data:", req.body);

  try {
    const { tags, ...cardData } = req.body;  // Separate tags from other card data

    // Use the Typegoose CardModel for the database operations
    const existingPostcard = await CardModel.findOneAndUpdate(
      { number: cardData.number },  // Query to find by 'number'
      { $set: cardData },           // Update the document with the new data
      { new: true, upsert: true }   // Create a new document if not found
    );

    if (tags && tags.length > 0) {
      // Process the tags and link them to the card
      await processTags(tags, existingPostcard._id.toString());
    }

    res.status(201).json(existingPostcard);
  } catch (err) {
    console.error('Error saving postcard:', err);
    res.status(500).json({ error: 'Error saving postcard' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
