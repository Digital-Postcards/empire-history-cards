import pandas as pd
from pymongo import MongoClient

def export_postmarked_postcards(mongo_uri, db_name, collection_name, output_excel_path):
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]
    
    # Query to get postcards with Postmarked as Yes
    postcards = collection.find({"postmarked": {"$regex": "^Yes"}})
    
    data = []
    for postcard in postcards:
        card_info = {
            "Number": postcard.get("number", ""),
            "Postmarked": postcard.get("postmarked", ""),
            "From Location": postcard.get("place", ""),
            "To Location": None  # Initialize To Location
        }
        
        # Extract 'To Location' from message if available
        message = postcard.get("message", "")
        if message and "to" in message:
            to_location = message.split("to")[-1].split()[0:2]  # Get phrase after 'to'
            card_info["To Location"] = ' '.join(to_location)
        
        data.append(card_info)
    
    # Convert to DataFrame and save to Excel
    df = pd.DataFrame(data, columns=["Number", "Postmarked", "From Location", "To Location"])
    df.to_excel(output_excel_path, index=False)
    
    print("Excel file created successfully!")

export_postmarked_postcards(
    mongo_uri='mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority',
    db_name="test",
    collection_name="cards",
    output_excel_path="output_postcards_analysis.xlsx"
)
