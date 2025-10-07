import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Metropolitan2() {
  const parameter = useParams();

  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [metartworks, setArtworks] = useState([]);
  const [error, setError] = useState();
  
  // State object to track visibility for each artwork by its unique ID: { id: boolean }
  const [imageVisibility, setImageVisibility] = useState({}); 

  const link = "/personalexhibition";

  const makeSearch = () => {
    console.log("Search button clicked. Starting API call for:", term);
    
    axios
      .get(
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${orderby}`
      )
      .then((artworks) => {
        // console.log(artworks.data.data[0].images.web.url);
        setArtworks(artworks.data.data);
        
        // Reset visibility state for new search results (optional, but good practice)
        setImageVisibility({}); 
        
        return artworks.data.data;
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });
  };

  const toggleVisibility = (id) => {
    // Toggles the visibility state for the specific artwork ID
    setImageVisibility(prevVisibility => ({
      ...prevVisibility,
      // Use logical NOT (!) to toggle the current state. Defaults to true if undefined/falsy.
      [id]: prevVisibility[id] === undefined ? false : !prevVisibility[id]
    }));
  };
  
  const addToCollection = (artwork) => {
    console.log("added");
    console.log(artwork.id);
    sessionStorage.setItem(artwork.id, JSON.stringify(artwork));
  };

  if (error) {
    return <div>No items have been found matching your query</div>;
  } else {
    return (
      <div>
        <a href={link}>
          <button>Go to Personal Exhibition</button>
        </a>
        <button onClick={makeSearch}>Search</button>
        <p>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </p>
        <button>Sort</button>
        <p>
          <input
            type="text"
            value={orderby}
            onChange={(e) => setOrderBy(e.target.value)}
          />
        </p>
        A list of the relevant artworks from the Cleveland Museum of Art:{" "}
        {metartworks.map((artwork) => {
          
          // Check if an image URL is available for this artwork
          const hasImage = artwork.images?.web?.url;
          
          // Determine the visibility state for this specific artwork.
          // If the ID is not in state, default it to true (visible).
          const isVisible = imageVisibility[artwork.id] !== false;

          return (
            <div key={artwork.id}>
              {/* Always display the title */}
              <p>{artwork.title}</p>
              
              {/* Conditional rendering for the image: must have a URL AND be set to visible */}
              {hasImage && isVisible && (
                <img 
                  src={artwork.images.web.url} 
                  width="500" 
                  height="500" 
                  alt={artwork.title || "Artwork image"}
                />
              )}
              
              {/* Only display the control buttons if an image URL exists */}
              {hasImage && (
                <>
                  {/* Button to toggle the visibility of THIS image */}
                  <button onClick={() => toggleVisibility(artwork.id)}>
                    {isVisible ? 'Hide Image' : 'Show Image'}
                  </button>
                  
                  {/* Add to collection button */}
                  <button onClick={() => addToCollection(artwork)}>
                    Add to collection
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}