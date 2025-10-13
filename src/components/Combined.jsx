import React, { useState } from "react";
import harvard_api_key from "../extra/API-KEY";
import axios from "axios";

export default function Combined() {
  const [harvardArtworks, setHarvardArtworks] = useState([]);
  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");

  const [new_order, setNewOrder] = useState("");

  const [clevelandArtworks, setClevelandArtworks] = useState([]);

  const [error, setError] = useState();

  const link = "/personalexhibition";

  const home_link = "/";

  const harvardSearch = () => {
    axios
      .get(
        `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&sort=${orderby}`
      )
      .then((harvardArtworks) => {
        //console.log("API call successful.");

        console.log(harvardArtworks.data.records);

        // FIX: Safely access the thumbnail URL for console logging using optional chaining
        // console.log(
        //   "Example thumbnail URL:",
        //   artworks.data.response.rows[0]?.content?.descriptiveNonRepeating
        //     ?.online_media?.media?.[0]?.thumbnail
        // );

        setHarvardArtworks(harvardArtworks.data.records);

        // Reset visibility state for new search results
        //setImageVisibility({});

        return harvardArtworks.data.records;
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });

    // const clevelandSearch = () => {

    //console.log("Search button clicked. Starting API call for:", cleveland_term, "with orderby:", cleveland_orderby);

    // Ensure the API call correctly uses the 'orderby' state

    if (orderby == "begindate") {
      console.log("it is newest");
      
      let cleveland_order = "recently_acquired";
      setNewOrder(cleveland_order);
      console.log(cleveland_order);
      
    }

    axios
      .get(
        // The API request is correctly constructed using the 'orderby' state
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${new_order}`
      )
      .then((clevelandArtworks) => {
        // console.log(artworks.data.data[0].images.web.url);
        console.log(clevelandArtworks.data.data);
        setClevelandArtworks(clevelandArtworks.data.data);

        // Reset visibility state for new search results
        // Keep it empty, as the rendering logic will now default to hidden.
        setImageVisibility({});

        return clevelandArtworks.data.data;
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });
    // };

    console.log("Search button clicked. Starting API call for:", term);

    // console.log(`http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&sort=${orderby}`);
  };

  // const clevelandSearch = () => {

  //   console.log("Search button clicked. Starting API call for:", cleveland_term, "with orderby:", cleveland_orderby);

  //   // Ensure the API call correctly uses the 'orderby' state
  //   axios
  //     .get(
  //       // The API request is correctly constructed using the 'orderby' state
  //       `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${cleveland_term}&orderby=${cleveland_orderby}`
  //     )
  //     .then((clevelandArtworks) => {
  //       // console.log(artworks.data.data[0].images.web.url);
  //       console.log(clevelandArtworks.data.data);
  //       setClevelandArtworks(clevelandArtworks.data.data);

  //       // Reset visibility state for new search results
  //       // Keep it empty, as the rendering logic will now default to hidden.
  //       setImageVisibility({});

  //       return clevelandArtworks.data.data;
  //     })
  //     .catch((err) => {
  //       setError(
  //         "A network error occurred or the search query returned nothing"
  //       );
  //     });
  // };

  return (
    <div>
      <a href={home_link}>
        <button>Home</button>
      </a>
      <a href={link}>
        <button>Go to Personal Exhibition</button>
      </a>
      <button onClick={harvardSearch}>Search</button>
      <p>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </p>
      Sort
      <p>
        <select
          // Removed type="text" as it's not a valid attribute for <select>
          value={orderby}
          onChange={(e) => setOrderBy(e.target.value)}>
          
        
          {/* Added a default option */}
          <option value="">No sort</option>
          {/* Options with meaningful values that the API expects harvard options */}

          <option value="relevancy">Relevancy</option>
          <option value="id">ID</option>
          <option value="begindate">Newest</option>
          <option value="updated">Updated</option>
          <option value="random">Random</option>
        </select>
      </p>
      {harvardArtworks.map((harvardArtwork) => {
        return (
          <div key={harvardArtwork.id}>
            <h3>{harvardArtwork.title}</h3>

            <img
              src={harvardArtwork.primaryimageurl} // Use the safely retrieved source
              width="300"
              height="300"
              // alt={artwork.title || "Artwork image"}
            />
          </div>
        );
      })}
      {clevelandArtworks.map((clevelandArtwork) => {
        return (
          <div key={clevelandArtwork.id}>
            <h3>{clevelandArtwork.title}</h3>

            <img
              src={clevelandArtwork.images?.web?.url}
              width="500"
              height="500"
              // alt={artwork.title || "Artwork image"}
            />
          </div>
        );
      })}
    </div>
  );
}
