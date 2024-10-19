from pymongo import MongoClient

# MongoDB connection
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test'] 
card_collection = db['cards']        
image_collection = db['images']


def process_card(card):
    """Process each card to make the required changes."""
    
    # 1. Change 'item' to lowercase if it exists
    if 'item' in card and isinstance(card['item'], str):
        card['item'] = card['item'].lower()

    # 2. Replace 'N/A' with None (null in MongoDB) for all string fields
    for key, value in card.items():
        if isinstance(value, str) and value == 'N/A':
            card[key] = None

    # 3. Convert 'number' to integer if it's currently a string
    if 'number' in card and isinstance(card['number'], str):
        try:
            card['number'] = int(card['number'])
        except ValueError:
            print(f"Could not convert number '{card['number']}' to integer.")
    
    return card

def process_image(image):
    """Process each image to convert cardNumber to integer."""
    
    # 1. Convert 'cardNumber' to integer if it's currently a string
    if 'cardNumber' in image and isinstance(image['cardNumber'], str):
        try:
            image['cardNumber'] = int(image['cardNumber'])
        except ValueError:
            print(f"Could not convert cardNumber '{image['cardNumber']}' to integer.")
    
    return image

def update_cards():
    # Find all cards in the collection
    cards = card_collection.find()

    for card in cards:
        # Process the card to make necessary changes
        updated_card = process_card(card)

        # Update the card in the database
        card_collection.update_one(
            {"_id": card["_id"]},  # Match by _id
            {"$set": updated_card}
        )
        print(f"Updated card with _id: {card['_id']}")
        
def update_images():
    # Find all images in the collection
    images = image_collection.find()

    for image in images:
        # Process the image to make necessary changes
        updated_image = process_image(image)

        # Update the image in the database
        image_collection.update_one(
            {"_id": image["_id"]},  # Match by _id
            {"$set": updated_image}
        )
        print(f"Updated image with _id: {image['_id']}")

if __name__ == "__main__":
    #update_cards()
    update_images()
    
