import React, { useState } from "react";
// FIX: Removed the failing import statement.
// Use a placeholder constant for the API key instead of the external import,
// as the "../extra/API-KEY" file cannot be resolved in this environment.
// NOTE: In a real application, replace "YOUR_HARVARD_API_KEY_HERE" with your actual key.
import harvard_api_key from "../extra/API-KEY";
import axios from "axios";

export default function Combined() {
  const [harvardArtworks, setHarvardArtworks] = useState([]);
  const [term, setTerm] = useState("");
  // 'orderby' will store the value selected in the dropdown, which is used for Harvard
  const [orderby, setOrderBy] = useState("");

  // hasImage will now hold '1', '0', or '' (for no filter)
  const [hasImage, setHasImage] = useState("");

  const [clevelandArtworks, setClevelandArtworks] = useState([]);

  const [error, setError] = useState();

  // FIX: Placeholder for imageVisibility state as it was used in the original logic
  const [imageVisibility, setImageVisibility] = useState({});

  const link = "/personalexhibition";
  const home_link = "/";

  const harvardSearch = () => {
    // --- Harvard API Call ---
    axios
      .get(
        // Note: hasImage state (which is '1', '0', or '') is passed directly
        `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&keyword=${orderby}&hasimage=${hasImage}`
      )
      .then((harvardArtworks) => {
        console.log("Harvard Results:", harvardArtworks.data.records);
        setHarvardArtworks(harvardArtworks.data.records);
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
      case "newest": // Newest in your dropdown
        cleveland_sort_value = "recently_acquired";
        break;
      case "title":
        cleveland_sort_value = "title";
        break;
      // Add more cases here as needed for other sorting options
      case "venues":
        cleveland_sort_value = "gallery";
        break;
      case "people":
        cleveland_sort_value = "artists";
        break;
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
        // Note: hasImage state (which is '1', '0', or '') is passed directly
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${cleveland_sort_value}&hasimage=${hasImage}`
      )
      .then((clevelandArtworks) => {
        console.log("Cleveland Results:", clevelandArtworks.data.data);
        //console.log(clevelandArtworks.data.data.creators[0].description);
        
        setClevelandArtworks(clevelandArtworks.data.data);
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
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-700">Artworks Search</h1>
        <div className="space-x-2">
          <a href={home_link}>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-150">
              Home
            </button>
          </a>
          <a href={link}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
              Go to Personal Exhibition
            </button>
          </a>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-grow">
          <label
            htmlFor="search-term"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Term
          </label>
          <input
            id="search-term"
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Monet, landscapes"
          />
        </div>

        <div>
          <label
            htmlFor="sort-order"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <select
            id="sort-order"
            value={orderby}
            onChange={(e) => setOrderBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">No sort</option>
            <option value="title">Title</option>
            <option value="newest">Newest</option>
            <option value="venues">Gallery</option>
            <option value="people">Artist</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="image-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Do you want images?
          </label>
          {/* This select uses user-friendly text (Yes/No) but passes API-friendly values (1/0)
            It also includes the 'No Filter' option which passes an empty string.
          */}
          <select
            id="image-filter"
            value={hasImage}
            onChange={(e) => setHasImage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">No Filter</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <button
          onClick={harvardSearch}
          className="mt-6 sm:mt-5 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-150 transform hover:scale-105"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="text-red-600 p-3 bg-red-100 border border-red-300 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Harvard Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
            Harvard Results ({harvardArtworks.length})
          </h2>
          {harvardArtworks.map((harvardArtwork) => (
            <div
              key={harvardArtwork.id}
              className="p-4 border border-gray-100 rounded-xl shadow-lg bg-white flex flex-col items-center text-center"
            >
              <h3 className="text-lg font-medium mb-2">
                {harvardArtwork.title}
              </h3>
              {harvardArtwork.primaryimageurl ? (
                <img
                  src={harvardArtwork.primaryimageurl}
                  width="300"
                  height="300"
                  className="rounded-lg object-cover w-full h-64 sm:w-64"
                  alt={harvardArtwork.title || "Harvard Artwork"}
                />
              ) : (
                <div className="w-full h-64 sm:w-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <p></p>
              Creation Date: {harvardArtwork.begindate}
              <p></p>
              Created By: {harvardArtwork.people?.[0]?.name}
              <p></p>
              Description: {harvardArtwork.description}
              <p></p>
              <a href={harvardArtwork.url}>Find out more</a>
            </div>
          ))}
        </div>

        {/* Cleveland Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-800 border-b pb-2">
            Cleveland Results ({clevelandArtworks.length})
          </h2>
          {clevelandArtworks.map((clevelandArtwork) => (
            <div
              key={clevelandArtwork.id}
              className="p-4 border border-gray-100 rounded-xl shadow-lg bg-white flex flex-col items-center text-center"
            >
              <h3 className="text-lg font-medium mb-2">
                {clevelandArtwork.title}
              </h3>
              {clevelandArtwork.images?.web?.url ? (
                <img
                  src={clevelandArtwork.images.web.url}
                  width="300"
                  height="300"
                  className="rounded-lg object-cover w-full h-64 sm:w-64"
                  alt={clevelandArtwork.title || "Cleveland Artwork"}
                />
              ) : (
                <div className="w-full h-64 sm:w-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <p></p>
              Creation Date: {clevelandArtwork.creation_date}
              <p></p>
              Created By: {clevelandArtwork.creators?.[0]?.description}
              <p></p>
              Description: {clevelandArtwork.description}
              <p></p>
              <a href={clevelandArtwork.url}>Find out more</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
