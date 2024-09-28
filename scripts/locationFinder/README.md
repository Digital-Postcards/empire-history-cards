# Extract location data from text

This script is designed to extract locations (cities and countries) from textual content.

# Requirements
- Python
- Node (minimum `lts/iron`)
- `pandoc`: used to convert `.docx` files to markdown (`md`) ([installed from here](https://pandoc.org/installing.html))

# Setup
- Install all dependencies required for the python script(s) from the `requirements.txt` file using `pip install -r requirements.txt`
  > It is recommended to create a python virtual environment before installing dependencies. If you do, please name it `.venv` so that the script can pick it up and activate it automatically.
- Ensure you have created a Google Cloud project with the Google Drive API enabled. You need to [create a service account and give access](https://developers.google.com/workspace/guides/create-credentials#service-account) to the _Transcripts_ folder from which the files have to be pulled.
- Place the credentials obtained in a file called `service.json` in the root directory of the script i.e. `locationFinder/`
- Certain environment variables are required for the script to function properly. Copy content from the `.example.env` file and put it in a new file called `.env`.
  ```text
  DRIVE_FOLDER_ID=<folder-id-of-the-transcripts-folder>
  LOCAL_DOCX_DIRECTORY=data/<folder-name-for-docx-transcripts> // recommended
  LOCAL_MD_DIRECTORY=data/<folder-name-for-md-transcripts> // recommended
  ```

# Running the script

Simply run [`./index.sh`](./index.sh)

## What happens?
Two kinds of scripts are executed when the bash script is run:
- [`python/index.py`](./python/index.py): uses the Google Drive API and performs the actual action of pulling files (with help from `python/docx_downloader.py`) from the Drive to the local filesystem and converting it to readable markdown format.
- [`js/index.js`](./js//index.js): parses the markdown files, creates a list of postmarked files and messages (with help from `js/transcriptParser.js`) as well as delegates the process of extracting locations to another python script (`python/location_extractor.py`)

## Results

- Two directories shuold be created at paths specified in the `.env` files for `.docx` transcripts and `.md` transcripts. They should contain the `.docx` and `.md` versions of the transcripts respectively.
- `postmarkedFiles.json` contains the list of transcripts with postmarks
- `messages.json` contains messages associated with each postmarked file
- `extractedLocations.json` contains locations extracted from each postmarked transcript and related file metadata