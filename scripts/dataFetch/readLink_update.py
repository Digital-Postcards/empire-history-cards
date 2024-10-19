import os
import pickle
import openpyxl
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# Set up the scope for Google Drive
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']

def authenticate_drive():
    """Authenticate and return a Google Drive API service."""
    creds = None
    # Check if the token.pickle file exists (stored credentials)
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If no valid credentials are available, request login via OAuth2
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('client_secret_218288037882-hno1mjp4tahot7vibqj322cuu1kg9ji4.apps.googleusercontent.com.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    # Return an authenticated service for Google Drive API
    service = build('drive', 'v3', credentials=creds)
    return service

def remove_file_extension(filename):
    """Remove the file extension from the filename."""
    return os.path.splitext(filename)[0]

def fetch_drive_images(service, folder_id):
    """Recursively fetch image file names and links from Google Drive, including subfolders."""
    all_images = []

    def fetch_images_in_folder(service, folder_id):
        # Query to fetch files and folders in the current folder
        query = f"'{folder_id}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType contains 'image/')"
        results = service.files().list(q=query, fields="files(id, name, mimeType, webViewLink)").execute()
        items = results.get('files', [])
        
        if not items:
            return []

        for item in items:
            # If the item is an image, add it to the list
            if 'image/' in item['mimeType']:
                all_images.append((remove_file_extension(item['name']), item['webViewLink']))
            # If the item is a folder, recursively fetch its contents
            elif item['mimeType'] == 'application/vnd.google-apps.folder':
                fetch_images_in_folder(service, item['id'])

    # Start fetching images from the root folder
    fetch_images_in_folder(service, folder_id)
    
    return all_images

def append_to_excel(image_data, file_name="image_links.xlsx"):
    """Append image data to an existing Excel file or create a new one if it doesn't exist."""
    # Check if the file already exists
    if os.path.exists(file_name):
        # Load the existing workbook
        wb = openpyxl.load_workbook(file_name)
        ws = wb.active
        print(f"Appending to existing Excel file '{file_name}'")
    else:
        # Create a new workbook and add headers
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Image Links"
        ws.append(["Image Name", "Google Drive Link"])  
        print(f"Creating new Excel file '{file_name}'")

    # Append the image data
    for image_name, link in image_data:
        ws.append([image_name, link])

    # Save the workbook
    wb.save(file_name)
    print(f"Data appended and saved to '{file_name}'")

# Authenticate with Google Drive API
service = authenticate_drive()

# Replace this with the folder ID from Google Drive (root folder)
folder_id = "1ZDMtyhuQho8TyqfiiqnCrW_t_8dGjC-4"

# Fetch image names and links from the specified folder and its subfolders
image_data = fetch_drive_images(service, folder_id)

# Append the data to the Excel file (or create a new one if it doesn't exist)
append_to_excel(image_data, "image_links_new.xlsx")
