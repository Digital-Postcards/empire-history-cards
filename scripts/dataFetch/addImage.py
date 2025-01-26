import os
import pandas as pd
import requests
from PIL import Image, ExifTags
from pymongo import MongoClient
from io import BytesIO

# Function to remove the file extension from the filename
def remove_file_extension(filename):
    return os.path.splitext(filename)[0]

# Function to extract image orientation and size from EXIF data
def extract_image_metadata(image_url):
    """Extract orientation and size from image's EXIF data and dimensions."""
    try:
        # Extract the file ID from the Google Drive link
        file_id = image_url.split('/d/')[1].split('/')[0]
        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        
        # Request the image content from the download URL
        response = requests.get(download_url)
        img = Image.open(BytesIO(response.content))

        # Extract orientation from EXIF data
        orientation = None
        if hasattr(img, '_getexif'):
            exif = img._getexif()
            if exif:
                for tag, value in exif.items():
                    tag_name = ExifTags.TAGS.get(tag, tag)
                    if tag_name == 'Orientation':
                        orientation = value
                        break

        # Extract image size (width, height in pixels)
        width, height = img.size

        return orientation, width, height
    except Exception as e:
        print(f"Error extracting metadata for {image_url}: {e}")
        return None, None, None

# Function to read the Excel file and get the image data
def read_excel_file(excel_path):
    df = pd.read_excel(excel_path)
    return df

# Function to insert or update image metadata into MongoDB
def insert_or_update_image_data(image_data, card_number, image_collection):
    inserted_ids = []

    for image in image_data:
        # Extract orientation and size
        orientation, width, height = extract_image_metadata(image['link'])

        # Use `update_one()` with `upsert=True` to either update or insert the image document
        result = image_collection.update_one(
            {"link": image['link']},  # Query to find the image by its Google Drive link
            {
                "$set": {
                    "name": image['name'],
                    "link": image['link'],
                    "size": {"width": width, "height": height},  # Store size as width and height
                    "orientation": orientation,
                    "cardNumber": card_number  # Associate the image with the card
                }
            },
            upsert=True  # If the document doesn't exist, create a new one
        )

        # Print success message for image storage
        if result.upserted_id:
            print(f"Inserted new image with name '{image['name']}' for card number {card_number}.")
            inserted_ids.append(result.upserted_id)  # Newly inserted
        else:
            # Find the existing image's _id to keep track of updated documents
            existing_image = image_collection.find_one({"link": image['link']})
            inserted_ids.append(existing_image['_id'])
            print(f"Updated existing image with name '{image['name']}' for card number {card_number}.")

    return inserted_ids

# Function to update the card document in MongoDB with image references
def update_card_with_images(card_number, inserted_image_ids, card_collection):
    # Print card number to debug
    print(f"Looking for card number: {card_number} in card collection...")

    # Check if the card exists
    card = card_collection.find_one({"number": int(card_number)})  # Ensure number is treated as an integer
    if card:
        print(f"Found card: {card_number}")
        # Try to update card with images
        result = card_collection.update_one(
            {"number": card_number},
            {"$set": {"imageLinks": inserted_image_ids}}
        )
        if result.modified_count > 0:
            print(f"Updated card {card_number} with image links.")
        else:
            print(f"Card {card_number} already has image links.")
    else:
        print(f"No card found for number {card_number}. Skipping card update.")

# Main function to process images and update MongoDB
def main():
    # Excel file path (replace with your actual path)
    excel_file = './lostImage.xlsx'

    # MongoDB connection
    mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
    client = MongoClient(mongo_uri)
    db = client['test'] 
    card_collection = db['cards']  # Cards collection
    image_collection = db['images']  # Images collection 

    # Read Excel file to get image metadata
    excel_data = read_excel_file(excel_file)

    # Iterate over each row in the Excel and insert or update images in MongoDB
    for _, row in excel_data.iterrows():
        image_name = row['Image Name']  # Image name from Excel
        image_link = row['Google Drive Link']  # Google Drive link from Excel

        # Extract the card number from the image name
        card_number = ''.join([c for c in image_name if c.isdigit()])

        # Prepare image data
        image_data = [{
            "name": image_name,
            "link": image_link,
        }]

        # Insert or update images into MongoDB and link to card
        inserted_image_ids = insert_or_update_image_data(image_data, card_number, image_collection)
        
        # Always store images, even if no card is found
        if inserted_image_ids:
            update_card_with_images(card_number, inserted_image_ids, card_collection)

if __name__ == "__main__":
    main()
