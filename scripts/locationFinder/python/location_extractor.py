import locationtagger
import nltk
import sys

from nltk import ne_chunk, pos_tag, word_tokenize
from nltk.tree import Tree

# extract locations from text
def extract_locations(message):
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

    # extract locations
    place_entity = locationtagger.find_locations(text = text)

    # get the cities and corresponding countries
    print(place_entity.country_cities)
    sys.stdout.flush()
    return 0

extract_locations(sys.argv[1])