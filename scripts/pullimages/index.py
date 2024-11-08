from dotenv import load_dotenv
import os
import io
import re

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

from pymongo import MongoClient

# scopes to gives access to the script
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

def connect_to_database():
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client[os.getenv('DATABASE_NAME')]
    return db

def update_doc_in_database(database, file_name, card_type):
    file_url = '/images/'+ card_type + '/' + file_name
    collection = database['iimages']

    cursor = collection.find_one({ 'name': file_name.split('.')[0] })
    image_path = cursor.get('link')
    pattern = re.compile(r"/images/[a-z]+cards/[A-Za-z0-9]+\.[a-z]+", re.IGNORECASE)
    match = pattern.match(image_path)

    if match != None:
        print('Document is already up to date\n')
    else:
        try:
            cursor = collection.update_one({ 'name': file_name.split('.')[0] }, { '$set': { 'link': file_url } })
            print('Updated ' + file_name + ' in database\n')
        except:
            print('Error updating document in database')
    
def pull_image(service, files, local_folder_path):
    # connect to db
    database = connect_to_database()
    for file in files:
        if file.get('mimeType') == 'image/jpeg' or file.get('mimeType') == 'image/png':
            file_name = os.path.join(local_folder_path, file.get('name'))
            if os.path.exists(file_name):
                print('Local copy of ' + file.get('name') + ' exists')
            else:
                request = service.files().get_media(fileId=file.get('id'))
                fh = io.FileIO(file_name, 'wb')
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    print(f"Downloaded {int(status.progress() * 100)}% of {file.get('name')}")
                fh.close()

            # update in database here
            update_doc_in_database(database, file.get('name'), 'postcards' if 'postcards' in local_folder_path else 'tradecard')
        else:
            print('File ' + file.get('name') + ' is not an image\n')

# authenticate using the service account credentials
def authenticate_google_drive_api():
    creds = service_account.Credentials.from_service_account_file('./service.json', scopes=SCOPES)
    drive_service = build('drive', 'v3', credentials=creds)
    return drive_service

def iterate_files_in_folder(service, folder_id):
    results = service.files().list(
        q=f"'{folder_id}' in parents",
        pageSize=100, fields="nextPageToken, files(id, name, mimeType)"
    ).execute()
    return results.get("files", [])

def main():
    # get environment variables
    load_dotenv()
    postcards_folder_id = os.getenv("POSTCARDS_DRIVE_FOLDER_ID")
    tradecards_folder_id = os.getenv("TRADECARDS_DRIVE_FOLDER_ID")
    local_postcards_folder = os.getenv("LOCAL_POSTCARDS_DIR")
    local_tradecards_folder = os.getenv("LOCAL_TRADECARDS_DIR")

    # create directories if they don't exist
    os.makedirs(local_postcards_folder, exist_ok=True)
    os.makedirs(local_tradecards_folder, exist_ok=True)

    # authenticate using service account credentials
    service = authenticate_google_drive_api()

    # get postcards
    postcards_sub_folders = iterate_files_in_folder(service, postcards_folder_id)
    # get tradecards
    tradecards_sub_folders = iterate_files_in_folder(service, tradecards_folder_id)
    
    # add a custom field to track card type
    postcards_sub_folders = [dict(item, type='postcard') for item in postcards_sub_folders]
    tradecards_sub_folders = [dict(item, type='tradecard') for item in tradecards_sub_folders]

    # combine lists
    combined_subfolders = postcards_sub_folders + tradecards_sub_folders

    for subfolder in combined_subfolders:
        # get cards in each subfolder
        cards = iterate_files_in_folder(service, subfolder["id"])
        # download images and store locally
        pull_image(service, cards, local_postcards_folder if subfolder.get('type') == "postcard" else local_tradecards_folder)

if __name__ == '__main__':
    main()