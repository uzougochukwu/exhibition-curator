import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import smithsonian_api_key from "../extra/API-KEY.js";

export default function Harvard() {
  const parameter = useParams();

  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [metartworks, setArtworks] = useState([]);
  const [error, setError] = useState();

  // State object to track visibility for each artwork by its unique ID: { id: boolean }
  // We don't need to change the initial state, as the logic below will handle the default.
  const [imageVisibility, setImageVisibility] = useState({});

  const [infoVisibility, setInfoVisibility] = useState({});

  const link = "/personalexhibition";

  const makeSearch = () => {
    console.log("Search button clicked. Starting API call for:", term);

    axios
      .get(
        `http://localhost:8080/api.si.edu/openaccess/api/v1.0/search?q=${term}&sort=${orderby}&api_key=${smithsonian_api_key}`
      )
      .then((artworks) => {
        console.log("here");

        // console.log(artworks.data.data[0].images.web.url);
        //console.log(artworks.data.response.rows);
        console.log(artworks.data.response.rows[0].content.freetext.date[0].content);
        
        setArtworks(artworks.data.response.rows);

        // Reset visibility state for new search results
        // Keep it empty, as the rendering logic will now default to hidden.
        setImageVisibility({});

        return artworks.data.response;
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });
  };

  const toggleInfoVisibility = (id) => {
    // set visibility of info for the specific artwork
    setInfoVisibility((prevInfoVisibility) => ({
      ...prevInfoVisibility,
      [id]:
        prevInfoVisibility[id] === undefined ? true : !prevInfoVisibility[id],
    }));
  };

  const toggleVisibility = (id) => {
    // Toggles the visibility state for the specific artwork ID
    setImageVisibility((prevVisibility) => ({
      ...prevVisibility,
      // If the ID is undefined (first click), set it to true (show).
      // Otherwise, use logical NOT (!) to toggle the existing state.
      [id]: prevVisibility[id] === undefined ? true : !prevVisibility[id],
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
        A list of the relevant artworks from the Smithsonian:{" "}
        {metartworks.map((artwork) => {
          // Check if an image URL is available for this artwork
          const hasImage = artwork.images?.web?.url;

          const isVisible = imageVisibility[artwork.id] === true;

          const isInfoVisible = infoVisibility[artwork.id] === true;
          //console.log(artwork.content);
          
          return (
            <div key={artwork.id}>
              {/* Always display the title */}
              <p>{artwork.title}</p>

              {isInfoVisible && (
                <div>
                  <p>Created: {artwork.content.freetext.date[0].content}</p>
                  <p>Department: {artwork.content.freetext.date[0].content}</p>
                  <p>Description: {artwork.description}</p>
                  <a href={artwork.content.descriptiveNonRepeating.guid}>Find out more</a>
                </div>
              )}

              {/* Conditional rendering for the image: must have a URL AND be set to visible */}
              {hasImage && isVisible && (
                <img
                  src={artwork.images.web.url}
                  width="500"
                  height="500"
                  alt={artwork.title || "Artwork image"}
                />
              )}

              {!hasImage && (
                <p>
                  [No Image Available]
                  <button onClick={() => toggleInfoVisibility(artwork.id)}>
                    {isInfoVisible ? "Hide Info" : "Show Info"}
                  </button>
                </p>
              )}

              {/* Only display the control buttons if an image URL exists */}
              {hasImage && (
                <>
                  {/* Button to toggle the visibility of THIS image */}
                  <button onClick={() => toggleVisibility(artwork.id)}>
                    {isVisible ? "Hide Image" : "Show Image"}
                  </button>

                  {/* Button to toggle visibility of info */}
                  <button onClick={() => toggleInfoVisibility(artwork.id)}>
                    {isInfoVisible ? "Hide Info" : "Show Info"}
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
