import React, { useState, useEffect, useCallback } from "react";

export default function PersonalExhibition() {
  const link = "/";
  const search = "/combined";
  const flowers = "/flowerexamples";
  const mountains = "/mountainexamples";

  const [collection, setCollection] = useState([]);

  // function to load the collection from sessionStorage
  const loadCollection = useCallback(() => {
    const artworks = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const storedItem = sessionStorage.getItem(key);

      try {
        const parsedArtwork = JSON.parse(storedItem);
        // Basic check to ensure it's a valid artwork object, using combinedId if present
        if (parsedArtwork && parsedArtwork.title && (parsedArtwork.id || parsedArtwork.combinedId)) {
          artworks.push(parsedArtwork);
        }
      } catch (error) {
        console.error(
          `Error parsing sessionStorage item for key ${key}:`,
          error
        );
      }
    }
    setCollection(artworks);
  }, []); 

  useEffect(() => {
    // load the collection when the component mounts
    loadCollection();
  }, [loadCollection]);

  // function to remove an artwork from sessionStorage and refresh the display
  const removeFromCollection = (artworkCombinedId) => {
    sessionStorage.removeItem(artworkCombinedId);
    loadCollection();
  };
  
  // --- Standard CSS Styles ---
  
  // Centers the entire content block by setting a max-width and using margin: auto. 
  // text-align: center centers all inline content within.
  const centeredContainerStyle = {
    maxWidth: '800px', // Equivalent to max-w-2xl
    margin: '0 auto', // Equivalent to mx-auto
    padding: '16px', // Equivalent to p-4
    textAlign: 'center', // Equivalent to text-center
  };
  
  // Centers the buttons/links group using Flexbox.
  const headerLinksStyle = {
    display: 'flex', // Equivalent to flex
    flexDirection: 'row', // Overrides flex-col for desktop view
    justifyContent: 'center', // Equivalent to justify-center
    gap: '16px', // Spacing between buttons
    marginBottom: '24px', // Equivalent to mb-6
    // Add mobile stack for responsiveness
    '@media (max-width: 640px)': {
        flexDirection: 'column',
        gap: '8px',
    }
  };
  
  // Styling for the individual card. Note the use of textAlign: 'left'.
  const artworkCardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Equivalent to shadow-md
    padding: '24px', // Equivalent to p-6
    margin: '24px 0', // Equivalent to my-6
    backgroundColor: 'white',
    textAlign: 'left', // Crucial to make the text readable inside the centered card
  };
  
  // Centers the image using Flexbox.
  const imageContainerStyle = {
    display: 'flex', // Equivalent to flex
    justifyContent: 'center', // Equivalent to justify-center
    margin: '12px 0', // Equivalent to my-3
  };
  
  // Style for the button look and feel (basic colors/shape)
  const buttonStylePrimary = {
    padding: '8px 16px',
    backgroundColor: '#4f46e5', // Indigo-600
    color: 'white',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  };
  
  const buttonStyleSecondary = {
    ...buttonStylePrimary,
    backgroundColor: '#e5e7eb', // Gray-200
    color: '#1f2937', // Gray-800
  };
  
  const buttonStyleDelete = {
    ...buttonStylePrimary,
    backgroundColor: '#ef4444', // Red-500
  };
  
  const headerTextStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#4f46e5', // Indigo-700
    marginBottom: '16px',
  };
  
  const linkStyle = {
    color: '#3b82f6', // Blue-500
    textDecoration: 'underline',
    display: 'block',
    marginBottom: '8px',
  };


  // --- Empty State Rendering ---
  if (collection.length === 0) {
    return (
      <div style={centeredContainerStyle}>
        <h2 style={headerTextStyle}>Personal Exhibition</h2>
        
        <div style={headerLinksStyle}>
            <a href={link}>
              <button style={buttonStyleSecondary}>
                Go to the Home page
              </button>
            </a>
            <a href={search}>
              <button style={buttonStylePrimary}>
                Search Artworks
              </button>
            </a>
        </div>
        
        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563', marginTop: '32px', marginBottom: '16px' }}>Example Exhibitions</p>
        <div style={{ marginBottom: '32px' }}>
            <a href={flowers} style={linkStyle}>Flowers</a>
            <a href={mountains} style={linkStyle}>Mountains</a>
        </div>
        
        <p style={{ fontSize: '1.25rem', fontWeight: '500', color: '#6b7280', marginTop: '40px' }}>Your personal exhibition is empty. Add some artworks!</p>
      </div>
    );
  }

  // --- Populated State Rendering ---
  return (
    <div style={centeredContainerStyle}>
      <h2 style={headerTextStyle}>Personal Exhibition</h2>
      
      <div style={headerLinksStyle}>
          <a href={link}>
            <button style={buttonStyleSecondary}>
              Go to the Home page
            </button>
          </a>
          <a href={search}>
            <button style={buttonStylePrimary}>
              Search Artworks
            </button>
          </a>
      </div>
      
      <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563', marginTop: '32px', marginBottom: '16px' }}>Example Exhibitions</p>
      <div style={{ marginBottom: '32px' }}>
            <a href={flowers} style={linkStyle}>Flowers</a>
            <a href={mountains} style={linkStyle}>Mountains</a>
      </div>
      
      {/* List of Artworks */}
      {collection.map((artwork) => {
          // Use the combinedId for removal and keying
          const artworkId = artwork.combinedId || artwork.id;
          const isHarvard = artwork.source === 'harvard';
          
          return (
            <div
              key={artworkId}
              style={artworkCardStyle}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>{artwork.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  <span style={{ fontWeight: '600' }}>Source:</span>{" "}
                  {isHarvard ? "Harvard Art Museums" : "Cleveland Museum of Art"}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                <span style={{ fontWeight: '600' }}>Date:</span>{" "}
                {artwork.begindate || artwork.creation_date || "Unknown"}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                <span style={{ fontWeight: '600' }}>By:</span>{" "}
                {artwork.people?.[0]?.name ||
                  artwork.creators?.[0]?.description ||
                  "N/A"}
              </p>

              {/* Image Container for Centering */}
              <div style={imageContainerStyle}>
                {/* Harvard Image */}
                {artwork.primaryimageurl && (
                  <img
                    src={artwork.primaryimageurl}
                    alt={artwork.title || "Harvard Artwork"}
                    style={{ width: '192px', height: '192px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    width="200"
                    height="200"
                  />
                )}

                {/* Cleveland Image */}
                {artwork.images?.web?.url && (
                  <img
                    src={artwork.images.web.url}
                    alt={artwork.title || "Cleveland Artwork"}
                    style={{ width: '192px', height: '192px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    width="200"
                    height="200"
                  />
                )}
              </div>
              
              <p style={{ fontWeight: '600', paddingTop: '8px' }}>Description:</p>
              <p style={{ color: '#374151', fontStyle: 'italic' }}>{artwork.description || "No description available."}</p>
              
              {artwork.url && (
                <a 
                  href={artwork.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#4f46e5', textDecoration: 'underline', fontWeight: '500', display: 'block', marginTop: '16px' }}
                >
                    View on External Website
                </a>
              )}

              {/* Delete Button */}
              <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                  <button 
                    onClick={() => removeFromCollection(artworkId)}
                    style={buttonStyleDelete}
                  >
                    Delete from Collection
                  </button>
              </div>
            </div>
          );
      })}
    </div>
  );
}