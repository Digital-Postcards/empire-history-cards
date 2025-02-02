from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB (adjust the connection string as needed)
# MongoDB connection
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test'] 
cards_collection = db['cards']  
images_collection = db['images'] 

def update_card_with_images():
    # Get all the cards
    cards = cards_collection.find()

    for card in cards:
        card_number = card.get('number')
        
        if card_number:
            # Find all images associated with this card by cardNumber
            images = images_collection.find({'cardNumber': card_number})
            
            # Extract the image IDs
            image_ids = [str(image['_id']) for image in images]
            
            if image_ids:
                # Update the card with the image IDs in the imageLinks array
                cards_collection.update_one(
                    {'_id': card['_id']},
                    {'$set': {'imageLinks': image_ids}}
                )
                print(f"Updated card {card_number} with image IDs: {image_ids}")
            else:
                print(f"No images found for card {card_number}")
        else:
            print(f"Card {card['_id']} does not have a valid card number")

# Run the update function
update_card_with_images()
