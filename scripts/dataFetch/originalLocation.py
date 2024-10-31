from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
from pymongo import MongoClient
import time

# Connect to MongoDB Atlas
mongo_uri = 'mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['test'] 
cards_collection = db['cards']

geolocator = Nominatim(user_agent="geo_locator", timeout=10)

# Dictionary to cache coordinates for countries
country_cache = {}
def normalize_place(place):
    """Standardize country names to ensure consistency."""
    if place.strip().lower() in ["u.s.a.", "usa", "united states", "america"]:
        return "USA"
    elif place.strip().lower() in ["germany", "deutschland"]:
        return "Germany"
    return place

def get_coordinates(place, retries=3):
    """Fetch coordinates for a place using geopy, with normalization and caching."""
    normalized_place = normalize_place(place)
    
    # Check cache for standardized country names
    if normalized_place in country_cache:
        print(f"Using cached coordinates for: {normalized_place}")
        return country_cache[normalized_place]

    for attempt in range(retries):
        try:
            print(f"Fetching coordinates for: {normalized_place} (Attempt {attempt + 1})")
            location = geolocator.geocode(normalized_place)
            if location:
                coords = {"latitude": location.latitude, "longitude": location.longitude}
                print(f"Coordinates for {normalized_place}: {coords}")
                # Cache coordinates for standardized country names
                if "," not in normalized_place:  # Assume it's a country if no comma
                    country_cache[normalized_place] = coords
                return coords
            else:
                print(f"No coordinates found for: {normalized_place}")
                return None
        except (GeocoderTimedOut, GeocoderUnavailable):
            print(f"Geocoding timed out or service unavailable for {normalized_place}. Retrying...")
            time.sleep(1)  # Wait a bit before retrying
    print(f"Failed to retrieve coordinates for {normalized_place} after {retries} attempts.")
    return None

def update_card_location(card):
    """Update the card document with originalLocation field."""
    place = card.get("place")
    
    # Skip geocoding if place is "Unknown" or empty
    if not place or place.strip().lower() == "unknown":
        print(f"Skipping card {card['_id']} due to unknown or missing place.")
        return

    coords = get_coordinates(place)
    if coords:
        cards_collection.update_one(
            {"_id": card["_id"]},
            {"$set": {"originalLocation": coords}}
        )
        print(f"Updated card {card['_id']} with location {coords}")
    else:
        print(f"Coordinates not found for {place}, skipping update for card {card['_id']}.")

# One-time cleanup: remove originalLocation from documents with place as "Unknown"
cleanup_result = cards_collection.update_many(
    {"place": "Unknown"},
    {"$unset": {"originalLocation": ""}}
)
print(f"Removed originalLocation from {cleanup_result.modified_count} documents with place as 'Unknown'.")

print("Starting the update process...")
for card in cards_collection.find():
    update_card_location(card)

print("Update completed.")
