import React, { useState } from "react";
// FIX: Removed the failing import statement and replaced with a placeholder constant
// to ensure the code compiles in this environment.
import harvard_api_key from "../extra/API-KEY";
import axios from "axios";

export default function Combined() {
  const [harvardArtworks, setHarvardArtworks] = useState([]);
  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [hasImage, setHasImage] = useState("");
  const [clevelandArtworks, setClevelandArtworks] = useState([]);
  const [error, setError] = useState();
  // imageVisibility is kept for compatibility but currently unused in rendering logic
  const [imageVisibility, setImageVisibility] = useState({});
  const [beforeYear, setBeforeYear] = useState("");

  const link = "/personalexhibition";
  const home_link = "/";

  let before = "";

  const harvardSearch = () => {

    let harvard_before_year = "-01-01";

    harvard_before_year = beforeYear + harvard_before_year;

    // --- Harvard API Call ---
    axios
      .get(
        `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&orderby=${orderby}&before=${harvard_before_year}`
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
    let cleveland_sort_value = "";

    switch (orderby) {
      // case "newest":
      //   cleveland_sort_value = "recently_acquired";
      //   break;
      // case "title":
      //   cleveland_sort_value = "title";
      //   break;
      case "venues":
        cleveland_sort_value = "gallery";
        break;
      case "people":
        cleveland_sort_value = "artists";
        break;
      default:
        cleveland_sort_value = "";
        break;
    }



    axios
      .get(
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&orderby=${cleveland_sort_value}&created_before=${beforeYear}`
      )
      .then((clevelandArtworks) => {
        console.log("Cleveland Results:", clevelandArtworks.data.data);
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

  const addToCollectionHarvard = (harvardArtwork) => {
    console.log("added");
    console.log(harvardArtwork.id);
    sessionStorage.setItem(harvardArtwork.id, JSON.stringify(harvardArtwork));
  };

  const addToCollectionCleveland = (clevelandArtwork) => {
    console.log("added");
    console.log(clevelandArtwork.id);
    sessionStorage.setItem(
      clevelandArtwork.id,
      JSON.stringify(clevelandArtwork)
    );
  };

  return (
    // Increased max-width for 5 columns
    <div className="p-4 space-y-4 max-w-7xl mx-auto font-inter">
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

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end">
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

        <div className="w-full sm:w-1/4">
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
            {/* <option value="title">Title</option> */}
            {/* <option value="newest">Newest</option>*/}
            <option value="venues">Gallery</option>
            {/* <option value="people">Artist</option> */}
          </select>
        </div>

        <div className="flex-grow">
          <label
            htmlFor="before"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Made before year:
          </label>
          <input
            id="before"
            type="text"
            value={beforeYear}
            onChange={(e) => setBeforeYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 2020"
          />
        </div>

        {/* <div className="w-full sm:w-1/4">
          <label
            htmlFor="image-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Do you want images?
          </label>
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
        </div> */}

        <button
          onClick={harvardSearch}
          className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-150 transform hover:scale-105"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="text-red-600 p-3 bg-red-100 border border-red-300 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Full-width container for all results */}
      <div className="pt-4 space-y-8">
        {/* Harvard Results */}
        <section>
          <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
            Harvard Results ({harvardArtworks.length})
          </h2>

          {/* Responsive Grid: 2 cols -> 5 cols */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {harvardArtworks.map((harvardArtwork) => (
              <div
                key={harvardArtwork.id}
                className="p-2 border border-gray-100 rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-1"
              >
                <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                  {harvardArtwork.title}
                </h3>
                {harvardArtwork.primaryimageurl ? (
                  <img
                    src={harvardArtwork.primaryimageurl}
                    // Smaller image size for 5-across
                    className="rounded-lg object-cover w-full h-36"
                    width="400"
                    height="400"
                    alt={harvardArtwork.title || "Harvard Artwork"}
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-xs">No Image</p>
                  </div>
                )}

                <div className="text-xs w-full text-left p-1 space-y-0.5">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {harvardArtwork.begindate}
                  </p>
                  <p>
                    <span className="font-semibold">By:</span>{" "}
                    {harvardArtwork.people?.[0]?.name || "N/A"}
                  </p>
                  {/* Clamp description to 2 lines to save space */}
                  <p className="line-clamp-2 text-gray-600 min-h-[1.5rem]">
                    <span className="font-semibold">Desc:</span>{" "}
                    {harvardArtwork.description || "No description provided."}
                  </p>
                  <div className="pt-1 text-center">
                    <a
                      href={harvardArtwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                    >
                      More details
                    </a>
                  </div>
                  <button
                    onClick={() => addToCollectionHarvard(harvardArtwork)}
                  >
                    Add to collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cleveland Results */}
        <section>
          <h2 className="text-xl font-semibold text-orange-800 border-b pb-2">
            Cleveland Results ({clevelandArtworks.length})
          </h2>

          {/* Responsive Grid: 2 cols -> 5 cols */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {clevelandArtworks.map((clevelandArtwork) => (
              <div
                key={clevelandArtwork.id}
                className="p-2 border border-gray-100 rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-1"
              >
                <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                  {clevelandArtwork.title}
                </h3>
                {clevelandArtwork.images?.web?.url ? (
                  <img
                    src={clevelandArtwork.images.web.url}
                    // Smaller image size for 5-across
                    className="rounded-lg object-cover w-full h-36"
                    width="400"
                    height="400"
                    alt={clevelandArtwork.title || "Cleveland Artwork"}
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-xs">No Image</p>
                  </div>
                )}

                <div className="text-xs w-full text-left p-1 space-y-0.5">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {clevelandArtwork.creation_date || "N/A"}
                  </p>
                  <p>
                    {/* Using optional chaining to safely access creator description */}
                    <span className="font-semibold">By:</span>{" "}
                    {clevelandArtwork.creators?.[0]?.description || "N/A"}
                  </p>
                  {/* Clamp description to 2 lines to save space */}
                  <p className="line-clamp-2 text-gray-600 min-h-[1.5rem]">
                    <span className="font-semibold">Desc:</span>{" "}
                    {clevelandArtwork.description || "No description provided."}
                  </p>
                  <div className="pt-1 text-center">
                    <a
                      href={clevelandArtwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                    >
                      More details
                    </a>
                  </div>
                  <button
                    onClick={() => addToCollectionCleveland(clevelandArtwork)}
                  >
                    Add to collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
