# Extract location data from text

This script is designed to pull images from the google drive and place it in a file system and update the image URLs in the MongoDB database

# Requirements
- Python

# Setup
- Install all dependencies required for the python script(s) from the `requirements.txt` file using `pip install -r requirements.txt`
  > It is recommended to create a python virtual environment before installing dependencies. If you do, please name it `.venv` so that the script can pick it up and activate it automatically.
- Ensure you have created a Google Cloud project with the Google Drive API enabled. You need to [create a service account and give access](https://developers.google.com/workspace/guides/create-credentials#service-account) to the _Transcripts_ folder from which the files have to be pulled.
- Place the credentials obtained in a file called `service.json` in the root directory of the script i.e. `pullimages/`
- Certain environment variables are required for the script to function properly. Copy content from the `.example.env` file and put it in a new file called `.env`.
  ```text
    MONGODB_URI=
    DATABASE_NAME=
    POSTCARDS_DRIVE_FOLDER_ID=
    TRADECARDS_DRIVE_FOLDER_ID=
    LOCAL_POSTCARDS_DIR=
    LOCAL_TRADECARDS_DIR=
  ```

# Running the script

Simply run [`./index.sh`](./index.sh)

## What happens?

The script downloads images from the Google Drive (from folders *Postcards* and *Tradecards*) and stores them on your local file system by creating a directory structure as specified by your environment variables `LOCAL_POSTCARDS_DIR` and `LOCAL_TRADECARDS_DIR`.
