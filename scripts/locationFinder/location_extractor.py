import nltk
import sys
import requests
import json
import time
import os
from dotenv import load_dotenv

from nltk import ne_chunk, pos_tag, word_tokenize
from nltk.tree import Tree

def sanitize_text(message):
    text = message.strip()
    labels = {}

    # remove person names from the text to avoid confusion with place names
    nltk_results = ne_chunk(pos_tag(word_tokenize(text)))

    for nltk_result in nltk_results:
        if type(nltk_result) == Tree:
            name = ''
            for nltk_result_leaf in nltk_result.leaves():
                name += nltk_result_leaf[0] + ' '
            if str(nltk_result.label()) == 'PERSON':
                labels[name] = ''

    for key, value in labels.items():
        text = text.replace(key.strip(), value)

    # no stopword removal because it hampers the performance of the API

    return text

def hit_geoparse_api(text):
    # https://api.geocodify.com/v2/geoparse?api_key=XXX&text=XXX
    api_url = "https://api.geocodify.com/v2/geoparse"

    params = {
        'text': text,
        'api_key': os.getenv("GEOCODIFY_API_KEY")
    }
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        resp_json = response.json()
        return resp_json
    
    print('Failed to get repsonse for text :(')
    return None

def check_meta_file_exists(filename):
    return os.path.exists(os.path.join(filename))

def filter_postmarked_files():
    if check_meta_file_exists("postmarkedFiles.json"):
        print(">> Reading existing postmarkedFiles.json <<")
        return

    paths = [os.path.join(os.getenv("LOCAL_MD_DIRECTORY"), fn) for fn in next(os.walk(os.getenv("LOCAL_MD_DIRECTORY")))[2]]
    postmarked_files = []
    for path in paths:
        with open(path, 'r') as file:
            # Read each line in the file
            for line in file:
                l = line.strip()
                is_postmarked = False
                postmark_line = ''
                if line.lower().startswith("postmarked"):
                    postmark = line.split(':')
                    if len(postmark) > 1:
                        postmark = postmark[1]
                        is_postmarked = postmark[0: 4].strip().lower() == 'yes'
                    postmark_line = line.strip()
                if is_postmarked == True:
                    postmarked_files.append({
                        'fileName' : os.path.basename(path),
                        'path': path,
                        'postMark': postmark_line
                    })
    with open('postmarkedFiles.json', 'w') as f:
        json.dump(postmarked_files, f)

def create_source_file_for_geoparsing():
    message_files = []
    with open('postmarkedFiles.json', 'r') as file:
        data = json.load(file)
        for index, item in enumerate(data):
            file_content = None
            with open(item['path'], 'r') as f:
                file_content = f.read()
            with open( item['path'], 'r' ) as f:
                for line in f:
                    if line.strip().lower().startswith('message'):
                        message = file_content[file_content.index(line):]
            data[index]['message'] = message
    
    with open('messages.json', 'w') as file:
        json.dump(data, file)

def extract_locations():
    with open('messages.json', 'r') as file:
        data = json.load(file)

        for index, message in enumerate(data):
            # clean the message
            clean_text = sanitize_text(message['message'])
            clean_postmark = sanitize_text(message['postMark'])

            respMessage = None
            respPostmark = None
            try:
                # make the API request
                respMessage = hit_geoparse_api(clean_text)
                time.sleep(1.1) # pause script for 1.1 seconds to not be rate limited by the API
                respPostmark = hit_geoparse_api(clean_postmark)
                time.sleep(1.1) # pause script for 1.1 seconds to not be rate limited by the API
            except:
                print('Ran into an exception :(')
            
            if respMessage != None:
                # update the data object with location information
                message['locationFromMessage'] = respMessage['response']['results']['places']
                print("\nLocation information extracted from message for '" + message['fileName'] + "'...")

            if respPostmark != None:
                # update the data object with location information
                message['locationFromPostmark'] = respPostmark['response']['results']['places']
                print("Location information extracted from postmark for '" + message['fileName'] + "'...")

        # save all data in locations.json
        with open('locations.json', 'w') as f:
            json.dump(data, f)

    # remove intermediate messages.json file
    os.remove(os.path.join('messages.json'))

    print("\n>> Check locations.json for all information about postmarked postcards <<")