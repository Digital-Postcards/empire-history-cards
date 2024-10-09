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
    """Fetch image file names and links from a specific Google Drive folder."""
    # Query to fetch all image files in the specific folder
    query = f"'{folder_id}' in parents and mimeType contains 'image/'"
    results = service.files().list(q=query, fields="files(id, name, webViewLink)").execute()
    items = results.get('files', [])
    
    if not items:
        print("No image files found in the specified folder.")
        return []
    
    # Store image name (without extension) and link as tuples
    image_data = [(remove_file_extension(file['name']), file['webViewLink']) for file in items]
    
    return image_data


def append_to_excel(image_data, file_name="image_links.xlsx"):
    """Append new image data to an existing Excel file."""
    # Load the existing Excel workbook
    if os.path.exists(file_name):
        wb = openpyxl.load_workbook(file_name)
        ws = wb.active
    else:
        print(f"Excel file '{file_name}' does not exist. Creating a new file.")
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Image Links"
        # Set headers if creating a new file
        ws.append(["Image Name", "Google Drive Link"])
    
    # Append the image data to the Excel file
    for image_name, link in image_data:
        ws.append([image_name, link])
    
    # Save the updated Excel file
    wb.save(file_name)
    print(f"Excel file '{file_name}' updated successfully.")

# Authenticate with Google Drive API
service = authenticate_drive()

# Replace this with the folder ID from Google Drive (change it as needed for new folder)
folder_id = "1ktdy9PoMtxw7P1XbhJGUOtArSLntiU6O"

# Fetch image names and links from the specific folder in Google Drive
image_data = fetch_drive_images(service, folder_id)

# Append the new image data to the existing Excel file
append_to_excel(image_data)
