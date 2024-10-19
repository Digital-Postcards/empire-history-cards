from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test']  # Replace with your actual database name
card_collection = db['cards']  # Cards collection
image_collection = db['images']  # Images collection

# Step 1: Remove the 'images' field from all documents in the cards collection
card_collection.update_many(
    {"images": {"$exists": True}},  # Find documents with the 'images' field
    {"$unset": {"images": ""}}  # Remove the 'images' field
)
print("Deleted 'images' field from all cards.")

# Step 2: Find all cards where the imageLinks field is empty or missing
cards_without_image_links = card_collection.find({"imageLinks": {"$exists": False}})

# Iterate over each card
for card in cards_without_image_links:
    card_number = card['number']  # Assuming 'number' is the card number field
    
    # Find all images with the same cardNumber
    images = list(image_collection.find({"cardNumber": str(card_number)}))
    
    if images:
        # Create a list of image ObjectIds
        image_ids = [img["_id"] for img in images]
        
        # Update the card with the list of image ObjectIds in the imageLinks field
        card_collection.update_one(
            {"_id": ObjectId(card['_id'])},
            {"$set": {"imageLinks": image_ids}}
        )
        print(f"Updated card {card_number} with {len(image_ids)} image link(s).")
    else:
        print(f"No images found for card {card_number}.")

print("Update process complete.")
