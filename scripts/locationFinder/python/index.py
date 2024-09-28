from google.oauth2 import service_account
from dotenv import load_dotenv
import os

# local functions
from docx_downloader import *

# scopes to gives access to the script
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# authenticate using the service account credentials
def authenticate_google_drive_api():
    creds = service_account.Credentials.from_service_account_file('./service.json', scopes=SCOPES)
    drive_service = build('drive', 'v3', credentials=creds)
    return drive_service
    
def main():
    # get environment variables
    load_dotenv()
    folder_id = os.getenv("DRIVE_FOLDER_ID")
    local_docx_folder = os.getenv("LOCAL_DOCX_DIRECTORY")
    local_md_folder = os.getenv("LOCAL_MD_DIRECTORY") 

    os.makedirs(local_docx_folder, exist_ok=True)
    os.makedirs(local_md_folder, exist_ok=True)

    # authenticate using service account credentials
    service = authenticate_google_drive_api()

    # make a list of all files in the google drive folder
    files = list_docx_files(service, folder_id)

    # save docx files locally
    for file in files[:20]:
        file_id = file['id']
        file_name = os.path.join(local_docx_folder, file['name'])
        download_docx_file(service, file_id, file_name)

    print("\n")

    # convert docx file to markdown for easier parsing
    for filename in os.listdir(local_docx_folder):
        markdown_file = docx_to_markdown(os.path.join(local_docx_folder, filename))
        file = open(os.path.join(local_md_folder, filename) + '.md', 'w')
        file.write(markdown_file)  
        file.close()

if __name__ == '__main__':
    main()