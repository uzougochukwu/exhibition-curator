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
  const [imageVisibility, setImageVisibility] = useState({});

  const [infoVisibility, setInfoVisibility] = useState({});

  const link = "/personalexhibition";

  const home_link = "/";

  const makeSearch = () => {
    console.log("Search button clicked. Starting API call for:", term);

    axios
      .get(
        `http://localhost:8080/api.si.edu/openaccess/api/v1.0/search?q=${term}&sort=${orderby}&api_key=${smithsonian_api_key}`
      )
      .then((artworks) => {
        console.log("API call successful.");

        // FIX: Safely access the thumbnail URL for console logging using optional chaining
        console.log(
          "Example thumbnail URL:",
          artworks.data.response.rows[0]?.content?.descriptiveNonRepeating
            ?.online_media?.media?.[0]?.thumbnail
        );

        setArtworks(artworks.data.response.rows);

        // Reset visibility state for new search results
        setImageVisibility({});

        return artworks.data.response;
      })
      .catch((err) => {
        console.error("API error:", err);
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
    console.log("added artwork with id:", artwork.id);
    sessionStorage.setItem(artwork.id, JSON.stringify(artwork));
  };

  if (error) {
    return <div>No items have been found matching your query</div>;
  } else {
    return (
      <div>
        <a href={home_link}><button>
          Home
          </button></a>
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
          // FIX: Use optional chaining to safely get the image source URL
          const imageSrc =
            artwork.content?.descriptiveNonRepeating?.online_media?.media?.[0]
              ?.thumbnail;

          const isVisible = imageVisibility[artwork.id] === true;
          const isInfoVisible = infoVisibility[artwork.id] === true;

          // Check for required info data
          const hasDate = artwork.content?.freetext?.date?.[0]?.content;
          const hasDataSource =
            artwork.content?.descriptiveNonRepeating?.data_source;
          const hasGuid = artwork.content?.descriptiveNonRepeating?.guid;

          return (
            <div
              key={artwork.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              {/* Always display the title */}
              <h3>{artwork.title}</h3>

              {/* Conditionally display info if set to visible */}
              {isInfoVisible && (
                <div>
                  {/* Safely display date, department, and link */}
                  {hasDate && (
                    <p>Created: {artwork.content.freetext.date[0].content}</p>
                  )}
                  {hasDataSource && (
                    <p>
                      Department:{" "}
                      {artwork.content.descriptiveNonRepeating.data_source}
                    </p>
                  )}
                  {artwork.description && (
                    <p>Description: {artwork.description}</p>
                  )}
                  {hasGuid && (
                    <a href={artwork.content.descriptiveNonRepeating.guid}>
                      Find out more
                    </a>
                  )}
                </div>
              )}

              {/* FIX: Conditional rendering for the image: must have a URL AND be set to visible */}
              {imageSrc && isVisible && (
                <img
                  src={imageSrc} // Use the safely retrieved source
                  width="50"
                  height="50"
                  alt={artwork.title || "Artwork image"}
                />
              )}

              {/* Message if no image is available */}
              {!imageSrc && <p>[No Image Available for this item]</p>}

              {/* Only display the "Show/Hide Image" button if an image source exists */}
              {imageSrc && (
                <button onClick={() => toggleVisibility(artwork.id)}>
                  {isVisible ? "Hide Image" : "Show Image"}
                </button>
              )}

              {/* Button to toggle visibility of info */}
              <button onClick={() => toggleInfoVisibility(artwork.id)}>
                {isInfoVisible ? "Hide Info" : "Show Info"}
              </button>

              {/* Add to collection button */}
              <button onClick={() => addToCollection(artwork)}>
                Add to collection
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
