import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Metropolitan2() {
  const parameter = useParams();

  const [term, setTerm] = useState("");

  const [metartworks, setArtworks] = useState([]);

  const [error, setError] = useState();

  const makeSearch = () => {
    console.log("Search button clicked. Starting API call for:", term);
    // setError(null); // Clear any previous error message
    // setArtworks([]); // Reset the artwork list before fetching new data
    // // ... rest of axios call
    axios
      .get(
        `http://localhost:8080/collectionapi.metmuseum.org/public/collection/v1/search?q=${term}?hasImages=true`
      )
      .then((artworks) => {
        console.log(artworks);

        //console.log(response.data["objectIDs"], response.data);
        console.log("here");
        setArtworks(artworks.data["objectIDs"]);
        //console.log(artworks);
        console.log(artworks.data["objectIDs"]);
        return artworks.data["objectIDs"];
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });
  };

  if (error) {
    return <div>No items have been found matching your query</div>;
  } else {
    return (
      <div>
        <button onClick={makeSearch}>Search</button>
        <p>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </p>
        A list of the relevant Metropolitan artworks:{" "}
        {metartworks.map((artwork) => {
          const link = "/objects/" + artwork;
          console.log(link);
          //console.log(search_by);

          return (
            <p key={artwork}>
              {" "}
              {artwork}{" "}
              <a href={link}>
                <button>Go to object</button>
              </a>
            </p>
          );
        })}
      </div>
    );
  }
}
