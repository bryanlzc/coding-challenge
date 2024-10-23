import React, { useState, useEffect } from 'react';

function StoreList() {
  const [stores, setStores] = useState([]);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [flags, setFlags] = useState([])

  useEffect(() => {
    // Fetch stores, books, and authors from the backend
    fetch('http://localhost:3000/stores')
      .then((response) => response.json())
      .then((data) => setStores(data?.data || []))
      .catch((error) => console.error('Error fetching stores:', error));

    fetch('http://localhost:3000/books')
      .then((response) => response.json())
      .then((data) => setBooks(data?.data || []))
      .catch((error) => console.error('Error fetching books:', error));

    fetch('http://localhost:3000/authors')
      .then((response) => response.json())
      .then((data) => setAuthors(data?.data || []))
      .catch((error) => console.error('Error fetching authors:', error));

    fetch('http://localhost:3000/countries')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data?.data || []);
        data?.data?.forEach((country) => fetchFlag(country.attributes.code))
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  // Helper function to format the date as dd.mm.yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Helper function to get books for each store (by matching book IDs)
  const getStoreBooks = (storeBooks) => {
    if (!storeBooks || !Array.isArray(storeBooks)) {
      return [];
    }
    const relatedBooks = storeBooks.map(bookRel => books.find(book => book.id === bookRel.id));
    const sortedBooks = relatedBooks.filter(book => book).sort((a,b) => b.attributes.copiesSold - a.attributes.copiesSold)

    return sortedBooks.slice(0,2)
  };

  // Helper function to get the author of a book (by matching author ID)
  const getBookAuthor = (book) => {
    if (!book || !book.relationships || !book.relationships.author) return 'Unknown';
    const authorId = book.relationships.author.data.id;
    const author = authors.find(author => author.id === authorId);
    return author ? author.attributes.fullName : 'Unknown Author';
  };

  const StarRating = ({ rating }) => {
    const totalStars = 5; // Maximum stars
    return (
      <div style={starRatingStyle}>
        {Array.from({ length: totalStars }, (v, i) => (
          <span key={i} style={{ color: i < rating ? '#FFD700' : '#ccc' }}>★</span>
        ))}
      </div>
    );
  };

  const getCountryCode = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.attributes.code : 'Unknown';
  };

  const fetchFlag = (countryCode) => {
    fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
      .then(response => response.json())
      .then(data => {
        // Set the flag URL in the state, keyed by the country code
        setFlags(prevFlags => ({ ...prevFlags, [countryCode]: data.flag }));
      })
      .catch(error => console.error(`Error fetching flag for ${countryCode}:`, error));
  };

  return (
    <div style={containerWrapperStyle}>
      <div style={storeListStyle}>
        {stores.map((store) => {
          const countryCode = getCountryCode(store.relationships.countries.data.id);
          const flagUrl = flags[countryCode]; // Get flag URL from state

          return (
            <div key={store.id} style={storeCardStyle}>
              {/* Star rating at the top-right corner */}
              <div style={countryStyle}>  
                <img 
                  src={flagUrl}
                  alt={`Flag of ${countryCode}`}
                  style={flagImageStyle}
                />
              </div>
              <StarRating rating={store.attributes?.rating || 0} />
              <div style={storeDetailsStyle}>
                <img 
                  src={store.attributes?.storeImage || 'https://via.placeholder.com/150'} 
                  alt={store.attributes?.name || 'Unknown Store'} 
                  style={imageStyle} 
                />
                {/* Store Info (name, rating, website) */}
                <div style={infoContainerStyle}>
                  <h2>{store.attributes?.name || 'Unknown Store'}</h2>

                  {/* Table displaying Best-Selling Books */}
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th colSpan="2" style={thHeaderStyle}>Best-Selling Books</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStoreBooks(store.relationships?.books?.data || []).length === 0 ? (
                        <tr>
                          <td colSpan="2" style={thTdStyle}>No Data Available</td> {/* Single row for "No Books" */}
                        </tr>
                      ) : (
                        getStoreBooks(store.relationships?.books?.data || []).map((book, index) => (
                          <tr key={index}>
                            <td style={thTdStyle}>{book?.attributes?.name || 'Unknown Book'}</td>
                            <td style={thTdStyle}>{getBookAuthor(book)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Display formatted establishment date */}
              <p>{formatDate(store.attributes?.establishmentDate || new Date())} - 
                <a href={store.attributes?.website} target="_blank" rel="noreferrer">  
                  {store.attributes?.website}
                </a> 
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Styles
const containerWrapperStyle = {
  textAlign: 'center',
  padding: '20px',
};

const storeListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  alignItems: 'center',
};

const storeCardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '20px',
  width: '1500px',           // Set a fixed width for the store cards
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'left',
  fontSize: '25px',
  position: 'relative'
};

const storeDetailsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '100px',
};

const imageStyle = {
  width: '250px',          // Fixed width
  height: '250px',         // Fixed height
  objectFit: 'cover',    // Scale the image down without cropping
  borderRadius: '50%',
  border: '2px solid #ccc',
};

const infoContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const tableStyle = {
  width: '1000px',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const thTdStyle = {
  border: '1px solid #000',  // Black border for table headers and cells
  padding: '10px',           // Padding inside the cells for readability
};

const thHeaderStyle = {
  textAlign: 'left',
  backgroundColor: '#f5f5f5',
  padding: '10px',
  fontWeight: 'bold',
  border: '1px solid #000',  // Add border to the header as well
};

const starRatingStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',  // Position it to the top-right corner
  fontSize: '20px',  // Size of the stars
};

const countryStyle = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',  // Position it to the top-right corner
  fontSize: '20px',  // Size of the stars
};

const flagImageStyle = {
  width: '50px',          // Fixed width
  height: '50px',         // Fixed height
  objectFit: 'cover',    // Scale the image down without cropping
  borderRadius: '50%',
  border: '2px solid #ccc',
};

export default StoreList;
