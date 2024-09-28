from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import pypandoc
import io
import os

# list all DOCX files in a Google Drive folder
def list_docx_files(service, folder_id):
    results = service.files().list(
        q=f"'{folder_id}' in parents and mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
        pageSize=1000, fields="nextPageToken, files(id, name)").execute()
    return results.get('files', [])

# download DOCX file from Google Drive
def download_docx_file(service, file_id, file_name):
    request = service.files().get_media(fileId=file_id)
    fh = io.FileIO(file_name, 'wb')
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"Downloaded {int(status.progress() * 100)}% of {file_name}")
    fh.close()

# convert docx file to markdown
def docx_to_markdown(file_path):
    file_name = os.path.basename(file_path)
    print("Converted " + file_name + " to markdown")
    return pypandoc.convert_file(file_path, 'markdown', format='docx')