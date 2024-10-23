
# Book Store Web Application

This project is a simple web application that displays a list of book stores and their best-selling books. The app fetches data from a backend API, including information about stores, books, authors, and countries. It also fetches country flags dynamically from an external API (RestCountries) based on the ISO 3166-1 country code.

## Features

- Displays book stores with their rating, establishment date, and website.
- Fetches and displays the top-selling books for each store, along with their authors.
- Shows the country flag based on the store's country code.
- Star rating system for stores.

## Prerequisites

To run this project locally, you'll need to have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (version 12 or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [yarn](https://yarnpkg.com/getting-started)

## Backend API

The backend API provides data for stores, books, authors, and countries. The project assumes the backend is running at `http://localhost:3000`. Make sure the backend API is up and running before starting the frontend.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-store-app.git
cd book-store-app
```

### 2. Install Dependencies

Make sure you install all the dependencies for the project using `npm` or `yarn`.

```bash
npm install
# OR
yarn install
```

### 3. Start the Development Server

Once dependencies are installed, you can start the React development server. This will also proxy requests to the backend API running on `localhost:5001`.

```bash
npm start
# OR
yarn start
```

The application will be available at `http://localhost:5001` in your browser.

### 4. Ensure the Backend is Running

The frontend application relies on a backend API for data. Ensure that the backend server is running and provides the necessary data at the following endpoints:

- `/stores`: Provides store information.
- `/books`: Provides book information.
- `/authors`: Provides author information.
- `/countries`: Provides country information with country codes.

You can run the backend API using Node.js. If you're using a mock backend server like `json-server` or a custom Express server, ensure it’s running on port `3000` or adjust the proxy configuration in the `package.json` file.

### 5. Country Flag Fetching

The application fetches country flags dynamically from the RestCountries API based on the 2-letter ISO 3166-1 country code.

- API Endpoint: `https://restcountries.com/v2/alpha/{country_code}`
- If you encounter issues with this API, you can modify the `fetchFlag` function to use a different API, such as `https://countryflagsapi.com/`.

## Project Structure

Here’s an overview of the project structure:

```
.
├── public
│   └── index.html           # Main HTML file
├── src
│   ├── App.js               # Main application logic
│   ├── index.js             # Entry point
│   └── styles.css           # Stylesheet
├── package.json             # Project configuration and dependencies
└── README.md                # Project documentation
```

## Key Files

- **App.js**: Main component of the application where the stores, books, and country data are fetched and displayed. Contains helper functions like `getStoreBooks`, `getBookAuthor`, and `fetchFlag`;Including reusable UI components like `StarRating` and store details components.

## Available Scripts

In the project directory, you can run the following commands:

- **`npm start`**: Runs the app in the development mode.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run build`**: Builds the app for production.

