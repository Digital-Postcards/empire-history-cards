# Documentation for the script 

## Extract the info from the transcript
Because the google drive API does not support directly read .doc file directly, we need to first download the transcript file to the local and read the info about it.
[scripts/dataFetch/database_extract.py](scripts/dataFetch/database_extract.py) is used to read the transciption and store it to database.

## Transcript Format

The transcript should follow the following format, and if it does not contain the certain info, just leave it blank.
'Number': number
'Item': item
'Date': date
'Postmarked': postmark or not 
'Place': original location
'Company': company
'CompanyInformation': company_info
'Description': description
'Analysis': analysis
'Message': message
'Destination':destination loction

## Tag Format
Here is the list of the standard tags:
Jim Crow
Mammy Stereotype
United States
Racist Caricature
Desexualization
Sentimentalization
Antebellum Nostalgia
Desexualization Caricature
Anthropological/ethnographic
Photographic
Hand Tinted
Animalization
White-bordered Postcard
French Empire
Sexualization
Tuck's
Linen
Infantilization
South Asia
Indian Ayah
British Empire
Orientalization
Moorli Dhur & Sons
Orientalism
Food
Men-servants
Sexual Impropriety
Working-class White Maidservants
Irish Bridget Stereotype
Harem Stereotype
New Imperialism
Coffee
Mexican Criada
Emasculation
Washing
Lazy/stupid Stereotype
Chinese “houseboy”/laundrymen
Uk
Tom Browne Illustration
Servants Insurance
Tea
Stamp-licking
Men Servants
Anti-semetic
Bamforth Postcards
Bamforth Postcard
Irish Bridget Stereotypes
Irish Bridget Sterotype
Working-class White Maidservant
Stupid/ Lazy Sterotype
Lazy/stupid Stereoype
Indonesian Baboe
Dutch Empire
Chinese Amah
Germany
Scrapbooking
Chinese "houseboy"/laundrymen
Asian Exclusion
Clothing/thread

