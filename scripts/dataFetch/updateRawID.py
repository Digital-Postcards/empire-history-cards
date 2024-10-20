from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test']  # Replace with your actual database name
card_collection = db['cards']  # Cards collection

# Find all cards with imageLinks that are stored as strings
cards_with_string_ids = card_collection.find({"imageLinks": {"$type": "array", "$elemMatch": {"$type": "string"}}})

# Iterate over each card and convert string IDs to ObjectId
for card in cards_with_string_ids:
    string_ids = card["imageLinks"]
    
    # Convert each string ID to ObjectId
    object_ids = [ObjectId(id_str) for id_str in string_ids]
    
    # Update the card with the new ObjectId values in imageLinks
    card_collection.update_one(
        {"_id": ObjectId(card["_id"])},
        {"$set": {"imageLinks": object_ids}}
    )
    
    print(f"Updated card {card['number']} to use ObjectId for imageLinks.")

print("Conversion process complete.")
