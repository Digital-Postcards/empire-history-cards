import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card, { ICard } from './models/Cards'; 

// Create Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
const mongoURI = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'; 
mongoose.connect(mongoURI) 
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json()); // Middleware to parse incoming JSON
// POST route to create a new postcard
app.post('/api/postcards', async (req: Request, res: Response) => {
  console.log("POST /api/postcards hit with data:", req.body);
  try {
    // Check if a postcard with the same 'number' exists, and update it, otherwise insert a new one
    const existingPostcard = await Card.findOneAndUpdate(
      { number: req.body.number },  // Query to find by 'number'
      { $set: req.body },           // Update the document with the new data
      { new: true, upsert: true }   // Create a new document if not found (upsert)
    );

    res.status(201).json(existingPostcard);  // Return the updated or inserted document
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
