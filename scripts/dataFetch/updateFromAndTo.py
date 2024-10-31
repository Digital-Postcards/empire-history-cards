import pandas as pd
from pymongo import MongoClient
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time


mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test'] 
collection = db['cards']   

# Initialize geocoder
geolocator = Nominatim(user_agent="postcard_locator")

def geocode_location(location):
    """Geocode a location string to latitude and longitude."""
    try:
        loc = geolocator.geocode(location, timeout=10)
        if loc:
            return loc.latitude, loc.longitude
    except GeocoderTimedOut:
        time.sleep(1)
        return geocode_location(location)  # retry on timeout
    return None, None

# Load the Excel file
file_path = 'output_postcards_analysis.xlsx'  
excel_data = pd.read_excel(file_path)

# Loop through each row in the Excel file to match and update MongoDB entries
for index, row in excel_data.iterrows():
    card_number = row["Number"]
    from_location = row["From Location"]
    to_location = row["To Location"]
    
    # Find the card in MongoDB by number
    card = collection.find_one({"number": card_number})
    
    if card:
        # Prepare the location data to update
        update_data = {}
        
        # Geocode "From Location" if it’s clear
        if pd.notna(from_location) and from_location.lower() != "unclear":
            from_lat, from_lon = geocode_location(from_location)
            if from_lat and from_lon:
                update_data["postLocation"] = {"latitude": from_lat, "longitude": from_lon}
        
        # Geocode "To Location" if it’s clear
        if pd.notna(to_location) and to_location.lower() != "unclear":
            to_lat, to_lon = geocode_location(to_location)
            if to_lat and to_lon:
                update_data["destinationLocation"] = {"latitude": to_lat, "longitude": to_lon}
        
        # Update the card in MongoDB if there's location data
        if update_data:
            collection.update_one({"_id": card["_id"]}, {"$set": update_data})

print("MongoDB cards have been updated with location data.")
