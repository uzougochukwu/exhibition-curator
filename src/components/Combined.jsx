import React, { useState } from "react";
import harvard_api_key from "../extra/API-KEY";
import axios from "axios";

export default function Combined() {
  const [harvardArtworks, setHarvardArtworks] = useState([]);
  const [term, setTerm] = useState("");
  // 'orderby' will store the value selected in the dropdown, which is used for Harvard
  const [orderby, setOrderBy] = useState("");

  // This state is not needed anymore for the solution below, but kept it commented out
  // const [new_order, setNewOrder] = useState("");

  const [clevelandArtworks, setClevelandArtworks] = useState([]);

  const [error, setError] = useState();

  // FIX: This image visibility state was in the original code, but not defined.
  // Defining it here so the original structure of your code is preserved and runnable.
  const [imageVisibility, setImageVisibility] = useState({});

  const link = "/personalexhibition";

  const home_link = "/";

  const harvardSearch = () => {
    // --- Harvard API Call ---
    axios
      .get(
        `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&sort=${orderby}`
      )
      .then((harvardArtworks) => {
        //console.log("API call successful.");

        console.log("Harvard Results:", harvardArtworks.data.records);

        setHarvardArtworks(harvardArtworks.data.records);

        // Reset visibility state for new search results
        setImageVisibility({});

        return harvardArtworks.data.records;
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });

    // --- Cleveland API Logic and Call ---

    // 1. Determine the appropriate sort value for Cleveland based on the Harvard 'orderby'
    let cleveland_sort_value = "";

    // The logic below maps the value selected in the dropdown ('orderby')
    // to a corresponding sort parameter for the Cleveland API.
    switch (orderby) {
      case "begindate": // Newest in your dropdown
        cleveland_sort_value = "recently_acquired";
        break;
      case "title":
        cleveland_sort_value = "title";
        break;
      // Add more cases here as needed for other sorting options
      case "venues":
        cleveland_sort_value = "gallery";
      case "people":
        cleveland_sort_value = "artists";
      default:
        // Use an appropriate default or an empty string for no specific sort
        cleveland_sort_value = "";
        break;
    }

    console.log(
      `Mapping Harvard 'orderby': ${orderby} to Cleveland 'orderby': ${cleveland_sort_value}`
    );

    // 2. Make the Cleveland API call using the determined 'cleveland_sort_value'
    axios
      .get(
        // Use the mapped value 'cleveland_sort_value' directly in the URL
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${cleveland_sort_value}`
      )
      .then((clevelandArtworks) => {
        console.log("Cleveland Results:", clevelandArtworks.data.data);
        setClevelandArtworks(clevelandArtworks.data.data);

        // Reset visibility state for new search results
        setImageVisibility({});

        return clevelandArtworks.data.data;
      })
      .catch((err) => {
        setError(
          "A network error occurred or the search query returned nothing"
        );
      });

    console.log("Search button clicked. Starting API call for:", term);
  };

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
          onChange={(e) => setOrderBy(e.target.value)}
        >
          {/* Added a default option */}
          <option value="">No sort</option>
          {/* Options with meaningful values that the API expects harvard options */}

          <option value="title">Title</option>
          <option value="begindate">Newest</option>
          <option value="venues">Gallery</option>
          <option value="people">Artist</option>
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
