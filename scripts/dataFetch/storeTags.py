import pandas as pd  # Import pandas for reading Excel files
from pymongo import MongoClient
from bson import ObjectId
import re  # Import regular expressions to handle extracting numbers from strings

# MongoDB connection URI
mongoURI = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongoURI)

# Define the database and collections
db = client['test']  # Replace with your actual database name
image_collection = db['images']  # Images collection
tag_collection = db['tags']  # Tags collection

# Step 1: Load the Excel data using pandas
df_tags = pd.read_excel('./Cleaned_Tag_Data.xlsx')

# Function to extract the card number from different formats
def extract_card_number(type_number):
    # Use a regular expression to extract digits from the string
    match = re.search(r'\d+', str(type_number))
    if match:
        return int(match.group())
    return None  # Return None if no number is found

# Function to process tags and update the Tag entity
def process_tags_for_cards(df_tags):
    for index, row in df_tags.iterrows():
        # Extract card number using the new function
        card_number = extract_card_number(row['Type - Number'])

        # If card_number is None, skip this row
        if card_number is None:
            print(f"Row {index} has an invalid 'Type - Number' format. Skipping.")
            continue

        # Find all images corresponding to the cardNumber in the MongoDB Image collection
        images = image_collection.find({"cardNumber": card_number})
        image_ids = [img['_id'] for img in images]  # Collect all image ObjectIDs for the cardNumber

        if not image_ids:
            print(f"No images found for card number {card_number}.")
            continue

        # Get the list of cleaned tags for this card
        cleaned_tags = eval(row['cleaned_tags'])  # Convert string representation of list to actual list

        # Process each tag for this card
        for tag_name in cleaned_tags:
            # Find the tag in the tag collection or create a new one
            tag = tag_collection.find_one({"name": tag_name})

            if not tag:
                # If the tag doesn't exist, create a new tag with the card and image references
                tag_id = tag_collection.insert_one({
                    "name": tag_name,
                    "cards": [card_number],  # Add the unique card number
                    "images": image_ids,  # Add the associated image ObjectIDs
                    "numberOfCards": 1  # Initialize with 1 unique card
                }).inserted_id
                print(f"Created new tag '{tag_name}' and linked it to card {card_number} and its images.")
            else:
                # Check if the card number is already linked to the tag
                card_update_needed = card_number not in tag['cards']
                image_update_needed = any(image_id not in tag['images'] for image_id in image_ids)

                # Add the card number if it's not already linked and increment the numberOfCards
                if card_update_needed or image_update_needed:
                    update_fields = {}
                    if card_update_needed:
                        update_fields["$addToSet"] = {"cards": card_number}
                        update_fields["$inc"] = {"numberOfCards": 1}
                    if image_update_needed:
                        if "$addToSet" in update_fields:
                            update_fields["$addToSet"]["images"] = {"$each": image_ids}
                        else:
                            update_fields["$addToSet"] = {"images": {"$each": image_ids}}

                    # Update the tag with new card and image data
                    tag_collection.update_one(
                        {"_id": tag['_id']},
                        update_fields
                    )
                    print(f"Updated tag '{tag_name}' with card {card_number} and its images.")
                else:
                    print(f"Card {card_number} and its images are already linked to tag '{tag_name}'. Skipping.")

# Step 2: Process and update the tags
process_tags_for_cards(df_tags)
