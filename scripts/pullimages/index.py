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
    if not cursor:
        print('Could not find ' + file_name.split('.')[0] + ' in database\n')
        return
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
        
        tradecard_pattern = re.compile(r"/images/tradecard/[A-Za-z0-9]+\.jpg", re.IGNORECASE)
        tradecard_match = pattern.match(image_path)

        if tradecard_match != None:
            collection.update_one({ 'name': file_name.split('.')[0], 'item': 'tradecard' }, { '$set': { 'link': file_url } })
            print('Updated ' + file_name + ' in database to be ' + file_url)
    
def pull_image(service, file, local_folder_path):
    # connect to db
    database = connect_to_database()
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
        update_doc_in_database(database, file.get('name'), 'postcards' if 'postcards' in local_folder_path else 'tradecards')
    else:
        print('File ' + file.get('name') + ' is not an image\n')

# authenticate using the service account credentials
def authenticate_google_drive_api():
    creds = service_account.Credentials.from_service_account_file('./service.json', scopes=SCOPES)
    drive_service = build('drive', 'v3', credentials=creds)
    return drive_service

def get_files_in_folder(service, folder_id):
    files = []
    page_token = None
    while True:
        response = service.files().list(
            q=f"'{folder_id}' in parents",
            pageSize=500,   # keep it larger than the maximum number of files in any folder, otherwise goes into an infinte loop
            fields="files(id, name, mimeType), nextPageToken"
        ).execute()
        for file in response.get('files', []):
            if file['mimeType'] == 'application/vnd.google-apps.folder':
                files.extend(get_files_in_folder(service, file['id']))
            else:
                files.append(file)
        page_token = response.get('nextPageToken')
        if not page_token:
            break
    return files

def main():
    # get environment variables
    load_dotenv()
    postcards_folder_id = os.getenv("POSTCARDS_DRIVE_FOLDER_ID")
    tradecards_folder_id = os.getenv("TRADECARDS_DRIVE_FOLDER_ID")
    postcard_carousel_folder_id = os.getenv("POSTCARDS_CAROUSEL_DRIVE_FOLDER_ID")
    tradecard_carousel_folder_id = os.getenv("TRADECARDS_CAROUSEL_DRIVE_FOLDER_ID")
    local_postcards_folder = os.getenv("LOCAL_POSTCARDS_DIR")
    local_tradecards_folder = os.getenv("LOCAL_TRADECARDS_DIR")
    postcards_carousel_images_folder = os.getenv("FRONTEND_POSTCARDS_CAROUSEL_IMAGES_DIR")
    tradecards_carousel_images_folder = os.getenv("FRONTEND_TRADECARDS_CAROUSEL_IMAGES_DIR")

    # create directories if they don't exist
    os.makedirs(local_postcards_folder, exist_ok=True)
    os.makedirs(local_tradecards_folder, exist_ok=True)
    os.makedirs(postcards_carousel_images_folder, exist_ok=True)
    os.makedirs(tradecards_carousel_images_folder, exist_ok=True)

    # authenticate using service account credentials
    service = authenticate_google_drive_api()

    # get postcards
    postcard_files = get_files_in_folder(service, postcards_folder_id)
    # get tradecards
    tradecard_files = get_files_in_folder(service, tradecards_folder_id)
    # get postcard carousel
    postcard_carousel_files = get_files_in_folder(service, postcard_carousel_folder_id)
    # get tradecard carousel
    tradecard_carousel_files = get_files_in_folder(service, tradecard_carousel_folder_id)
    
    # add a custom field to track card type
    postcard_files = [dict(item, type='postcard') for item in postcard_files]
    tradecard_files = [dict(item, type='tradecard') for item in tradecard_files]

    # combine lists
    combined_files = postcard_files + tradecard_files

    for file in combined_files:
        # download images and store locally
        pull_image(service, file, local_postcards_folder if file.get('type') == "postcard" else local_tradecards_folder)
    
    # download postcard carousel images
    for file in postcard_carousel_files:
        pull_image(service, file, postcards_carousel_images_folder)
    
    # download tradecard carousel images
    for file in tradecard_carousel_files:
        pull_image(service, file, tradecards_carousel_images_folder)

if __name__ == '__main__':
    main()