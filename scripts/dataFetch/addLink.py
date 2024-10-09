import pandas as pd
from pymongo import MongoClient

# Load the Excel file (replace with the correct path to your Excel file)
excel_file = './image_links.xlsx' 
df = pd.read_excel(excel_file)

# Connect to MongoDB
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test']  # Replace with your actual database name
collection = db['cards']         # Replace with your actual collection name

# Function to group image links by card number
def group_images_by_card(df):
    card_images = {}

    for index, row in df.iterrows():
        image_name = row['Image Name']  # e.g., "52A"
        image_link = row['Google Drive Link']

        # Extract the card number by removing the trailing letter (A or B)
        card_number = ''.join([c for c in image_name if c.isdigit()])

        # If the card number already exists, append the image link, else create a new list
        if card_number in card_images:
            card_images[card_number].append(image_link)
        else:
            card_images[card_number] = [image_link]

    return card_images

# Group images by card number
card_images = group_images_by_card(df)

# Update MongoDB with the image links for each card
for card_number, image_links in card_images.items():
    result = collection.update_one(
        {"number": card_number},  # Match by card number
        {"$set": {"imageLinks": image_links}}  # Add the imageLinks field with the list of links
    )
    if result.modified_count > 0:
        print(f"Updated card {card_number} with image links.")
    else:
        print(f"No update for card {card_number} (card may not exist).")
