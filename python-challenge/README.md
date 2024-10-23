
# NY Times API Data Loader

This project is a Python script that interacts with the New York Times Article Search API. It allows fetching articles based on a search query, flattens the nested JSON structure, and returns the article data in batches. The schema (field names) of the articles can also be extracted dynamically from the API responses.

## Features

- Fetches articles from the NY Times API using a query.
- Retrieves articles in batches for efficient data processing.
- Flattens nested JSON data for easier usage.
- Outputs the schema (field names) of the article data.
  
## Requirements

- Python 3.10 or later
- Access to the New York Times API (you will need an API key)

## Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Create a Virtual Environment**

   It is recommended to create a virtual environment to manage dependencies. Run the following command to create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source venv/bin/activate
   ```

   To deactivate the virtual environment, you can run:

   ```bash
   deactivate
   ```

3. **Install Required Packages**

   Install the required Python packages listed in the `requirements.txt` file.

   ```bash
   pip install -r requirements.txt
   ```

## Configuration

You will need a New York Times API key to use this script. You can obtain it by signing up at the [NY Times Developer Portal](https://developer.nytimes.com/).

Once you have your API key, you can configure it in the `.env` file.

```env
API_KEY = "your_api_key_here"
```

Replace `"your_api_key_here"` with your actual API key

```python
config = {
    "api_key": f"{os.getenv('API_KEY')}",
    "query": "query here",
}
```

Modify the `query here` as needed.

## Usage

1. **Run the Script**

   After configuring the script and ensuring the environment is set up, you can run the script using:

   ```bash
   python3 your_script.py
   ```

   The script will fetch articles in batches (as defined in the script) and output the article IDs and their main headlines.

   Example output:

   ```bash
   Fetching page 1...
   0 Batch of 10 items
     - 1234 - The main headline
   Schema - ['_id', 'headline.main']
   ```

2. **Customizing Batch Size and Pages**

   The `getDataBatch` function accepts two parameters:
   - `batch_size`: The number of articles to include in each batch.
   - `max_pages`: The maximum number of pages to fetch from the API.

   You can adjust these parameters as needed.

## Functions

- `connect`: Establishes a connection (logs incremental values).
- `disconnect`: Placeholder method (does nothing).
- `flatten_dict`: Recursively flattens nested dictionaries and lists into a single-level dictionary.
- `getDataBatch`: Fetches articles in batches from the NY Times API.
- `getSchema`: Returns the schema (field names) of a given document.

## Example

Here's an example of running the script and fetching data in batches:

```python
for idx, batch in enumerate(source.getDataBatch(10, max_pages=5)):
    print(f"{idx} Batch of {len(batch)} items")
    for item in batch:
        print(f"  - {item['_id']} - {item['headline.main']}")
        print(f"Schema - {source.getSchema(item)} 
")
```

This will print the ID, headline, and schema of each article in the batches.