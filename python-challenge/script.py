import argparse
import logging
import requests
from dotenv import load_dotenv
import os

"""
Skeleton for Coding Challenge
January 2024
"""

log = logging.getLogger(__name__)

class NYTimesSource(object):
    """
    A data loader plugin for the NY Times API.
    """

    def __init__(self):
        self.base_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
        self.args = None

    def connect(self, inc_column=None, max_inc_value=None):
        """Connect to the source"""
        log.debug("Incremental Column: %r", inc_column)
        log.debug("Incremental Last Value: %r", max_inc_value)

    def disconnect(self):
        """Disconnect from the source."""
        # Nothing to do
        pass

    def flatten_dict(self, d, parent_key='', sep='.'):
        """
        Flatten a nested dictionary.

        :param d: The dictionary to flatten.
        :param parent_key: The base key (used in recursion, defaults to an empty string).
        :param sep: The separator to use between keys (defaults to '.').
        
        :returns: A new flattened dictionary.
        """
        items = []
        
        for k, v in d.items():
            new_key = f'{parent_key}{sep}{k}' if parent_key else k
            
            if isinstance(v, dict) and v:
                # If the value is a non-empty dictionary, recurse
                items.extend(self.flatten_dict(v, new_key, sep=sep).items())
            elif isinstance(v, list):
                # Handle lists by indexing each element
                for i, item in enumerate(v):
                    items.extend(self.flatten_dict({f'{i}': item}, new_key, sep=sep).items())
            else:
                # Add the key-value pair if the value is not a dict or list
                items.append((new_key, v))
        
        return dict(items)



    def getDataBatch(self, batch_size, max_pages):
        """
        Generator - Get data from source on batches.

        :returns One list for each batch. Each of those is a list of
                 dictionaries with the defined rows.
        """
        # # TODO: implement - this dummy implementation returns one batch of data
        # yield [
        #     {
        #         "headline.main": "The main headline",
        #         "_id": "1234",
        #     }
        # ]
        
        params = {
            'q': self.args.query,
            'api-key': self.args.api_key,
            'page': 0  # Start from page 0
        }

        for current_page in range(max_pages):
            print(f"Fetching page {current_page + 1}...")
            response = requests.get(self.base_url, params=params)
            
            if response.status_code != 200:
                print(f"Error: {response.status_code}")
                break

            data = response.json()
            docs = data.get('response', {}).get('docs', [])

            flattened_docs = [self.flatten_dict(doc) for doc in docs]

            # print("Flattened_docs: ", flattened_docs)
            
            # Yield the data in batches
            for i in range(0, len(flattened_docs), batch_size):
                yield flattened_docs[i:i + batch_size]

            # Stop if no more articles are found
            if not flattened_docs:
                break
            
            # Update the page number for the next iteration
            params['page'] += 1


    def getSchema(self, doc):
        """
        Return the schema of the dataset
        :returns a List containing the names of the columns retrieved from the
        source
        """
        # Assuming columns retrieved from the source are already flattened
        if not isinstance(doc, dict):
            raise ValueError("Document should be a dictionary")
        
        # Return the keys of the dictionary as column names
        return list(doc.keys())


if __name__ == "__main__":
    load_dotenv()
    config = {
        "api_key": f"{os.getenv('API_KEY')}",
        "query": "Silicon Valley",
    }
    source = NYTimesSource()

    # This looks like an argparse dependency - but the Namespace class is just
    # a simple way to create an object holding attributes.
    source.args = argparse.Namespace(**config)

    for idx, batch in enumerate(source.getDataBatch(10, max_pages=5)):
        print(f"{idx} Batch of {len(batch)} items")
        for item in batch:
            print(f"  - {item['_id']} - {item['headline.main']}")
            print(f"Schema - {source.getSchema(item)} \n")


