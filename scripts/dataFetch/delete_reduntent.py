from pymongo import MongoClient

# Replace this with your actual MongoDB connection string
mongo_uri = "mongodb+srv://NEU-historicPostcardProject:adminNEU@devconnector.wdklp6m.mongodb.net/?retryWrites=true&w=majority"

# Connect to the MongoDB server
client = MongoClient(mongo_uri)

# Connect to the database and collection
db = client['test']  # Replace with your actual database name
collection = db['cards']         # Replace with your actual collection name


# Find duplicate records by the 'number' field
pipeline = [
    {
        "$group": {
            "_id": "$number",        # Group by the 'number' field
            "count": { "$sum": 1 },  # Count how many times each 'number' appears
            "docs": { "$push": "$_id" }  # Collect all the document IDs for each 'number'
        }
    },
    {
        "$match": {
            "count": { "$gt": 1 }    # Only show groups where count > 1 (duplicates)
        }
    }
]

# Run the aggregation query to find duplicates
duplicates = list(collection.aggregate(pipeline))

print(f"Found {len(duplicates)} numbers with duplicates.")

# Loop through each set of duplicates
for duplicate in duplicates:
    number = duplicate['_id']
    ids_to_delete = duplicate["docs"][1:]  # Keep the first one, delete the rest
    
    # Perform the deletion
    result = collection.delete_many({"_id": {"$in": ids_to_delete}})
    
    print(f"Deleted {result.deleted_count} duplicate(s) for number '{number}'.")

print("Duplicate cleanup complete.")