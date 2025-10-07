import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Metropolitan2() {
  const parameter = useParams();

  const [term, setTerm] = useState("");

  const [orderby, setOrderBy] = useState("");

  const [metartworks, setArtworks] = useState([]);

  const [error, setError] = useState();

  const [imageVisibility, setImageVisibility] = useState({});

  const link = "/personalexhibition";

  const makeSearch = () => {
    console.log("Search button clicked. Starting API call for:", term);
    // setError(null); // Clear any previous error message
    // setArtworks([]); // Reset the artwork list before fetching new data
    // // ... rest of axios call
    // orderby works for credit, catalogue_raisonne, collection, classification_type, department, gallery, medium, recently_acquired
    axios
      .get(
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${orderby}`
      )
      .then((artworks) => {
        console.log(artworks.data.data[0].images.web.url);

        //console.log(response.data["objectIDs"], response.data);
        //console.log("here");
        setArtworks(artworks.data.data);

        setImageVisibility({});

        //console.log(artworks);
        //console.log(artworks.data["objectIDs"]);
        return artworks.data.data;
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });
  };

  const toggleVisibility = (id) => {
    setImageVisibility((prevVisibility) => ({
      ...prevVisibility,
      // Toggle the boolean value for the specific ID
      [id]: !prevVisibility[id],
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
          const link = "/objects/" + artwork;
          // get specific visibility: default to true (visible) if not set
          const isVisible = imageVisibility[artwork.id] !== false;
          const hasImage = artwork.images?.web?.url;

          return (
            <div key={artwork.id}>
              <p> {artwork.title}</p>
              {hasImage && isVisible && (
                <img
                  src={artwork.images.web.url}
                  width="500"
                  height="500"
                  alt={artwork.title}
                ></img>
              )}

              {/* only show buttons if the artwork has an image url*/}
              {hasImage && (
                <>
                  <button onClick={() => toggleVisibility(artwork.id)}>
                    {isVisible ? "Hide Image" : "Show Image"}
                  </button>

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
