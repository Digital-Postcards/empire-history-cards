import docx
import os
import re
import requests  # To send HTTP POST request to Node.js API

def extract_postcard_data(docx_path):
    doc = docx.Document(docx_path)
    content = '\n'.join([p.text for p in doc.paragraphs])

    # Helper function to safely extract data using regex
    def safe_search(pattern, text, flags=0):
        match = re.search(pattern, text, flags)
        return match.group(1).strip() if match else 'N/A'

    # Regex to extract the fields, using safe_search to avoid NoneType issues
    number = safe_search(r'Number:\s*(\d+)', content)
    item = safe_search(r'Item:\s*(.*)', content)
    postmark = safe_search(r'Postmarked:\s*(.*)', content)
    date = safe_search(r'Date\s*:\s*(.*)', content)
    place = safe_search(r'Place:\s*(.*)', content)
    company = safe_search(r'Company:\s*(.*)', content)
    company_info = safe_search(r'Information about Company:\s*(.*?)(?=\n[A-Z])', content, re.DOTALL)
    description = safe_search(r'Description:\s*(.*)', content, re.DOTALL)
    analysis = safe_search(r'Analysis:\s*(.*)', content, re.DOTALL)
    message = safe_search(r'Message:\s*(.*)', content, re.DOTALL)
    
    # Return extracted data
    return {
        'number': number,
        'item': item,
        'date': date,
        'postmarked': postmark,
        'place': place,
        'company': company,
        'companyInformation': company_info,
        'description': description,
        'analysis': analysis,
        'message': message
    }

def save_to_mongodb(data):
    response = requests.post('http://localhost:3000/api/postcards', json=data)
    if response.status_code == 201:
        print(f"Postcard {data['number']} saved successfully!")
    else:
        print(f"Failed to save postcard {data['number']}: {response.text}")

# Directory containing DOCX files
docx_dir = './transcripts'

# Loop through DOCX files and extract data
for filename in os.listdir(docx_dir):
    if filename.endswith(".docx"):
        docx_path = os.path.join(docx_dir, filename)
        postcard_data = extract_postcard_data(docx_path)
        save_to_mongodb(postcard_data)
