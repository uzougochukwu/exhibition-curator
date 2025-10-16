import React, { useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

// FIX: Placeholder for API key
import harvard_api_key from "../extra/API-KEY";

// --- Helper Component for Rendering Artworks and Handling Pagination ---
const PaginatedItems = ({
  items,
  currentPage,
  itemsPerPage,
  handlePageClick,
  totalPages,
  title,
  isHarvard,
  addToCollection,
}) => {
  // 💥 MODIFIED STATE: Initialize with a structure that implies all items are hidden.
  // We use a dummy key here, but the actual hiding logic is often tied to the
  // ID within the currentItems map. We'll rely on the toggle state structure.
  const [hiddenImages, setHiddenImages] = useState({});
  const [hiddenInfo, setHiddenInfo] = useState({});

  // --- Toggle Handlers ---
  const toggleImage = (id) => {
    // This uses a function update to ensure we check the *latest* value.
    // By default, if an ID is not in the object, it's treated as 'false' (shown).
    // To reverse this logic to 'hidden by default', we will need to change how we check it.
    // However, the cleanest React way is to let the initial state be empty and
    // update the JSX check.
    setHiddenImages((prev) => ({
      ...prev,
      [id]: !prev[id], // Flip the current state for this ID
    }));
  };

  const toggleInfo = (id) => {
    setHiddenInfo((prev) => ({
      ...prev,
      [id]: !prev[id], // Flip the current state for this ID
    }));
  };
  // -------------------------

  // Calculate items to display on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  const CollectionButton = isHarvard
    ? ({ artwork }) => (
        <button
          onClick={() => addToCollection(artwork)}
          className="mt-2 w-full px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Add to collection
        </button>
      )
    : ({ artwork }) => (
        <button
          onClick={() => addToCollection(artwork)}
          className="mt-2 w-full px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Add to collection
        </button>
      );

  const headerColor = isHarvard ? "text-blue-800" : "text-orange-800";
  const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

  if (items.length === 0) {
    return null;
  }

  // Calculate the 1-based current page number for display
  const displayCurrentPage = currentPage + 1;

  // --- Reusable Pagination Controls Component ---
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-2 sm:space-y-0 sm:space-x-4">
      {/* Display current page and total pages */}
      <div className="text-sm font-medium text-gray-700">
        Page <span className="font-bold">{displayCurrentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
        forcePage={currentPage}
        // Tailwind CSS classes for styling
        containerClassName="pagination flex space-x-2"
        pageLinkClassName="px-3 py-1 rounded-lg text-sm transition duration-150 border border-gray-300 hover:bg-gray-100"
        previousLinkClassName="px-3 py-1 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
        nextLinkClassName="px-3 py-1 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
        activeLinkClassName="bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600"
        disabledLinkClassName="text-gray-400 cursor-not-allowed"
      />
    </div>
  );

  return (
    <section>
      <h2 className={`text-xl font-semibold ${headerColor} border-b pb-2`}>
        {title} ({items.length} total)
      </h2>

      {/* Pagination Controls - TOP */}
      {totalPages > 1 && <PaginationControls />}

      {/* Responsive Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
        {currentItems.map((artwork) => {
          const artworkId = String(artwork.id);

          // 💥 KEY CHANGE: Check if the ID is NOT in the hidden map (meaning it is FALSE or undefined)
          // If the ID is NOT in the map (initial state), we assume it's HIDDEN (true).
          // If the ID is set to FALSE, it's SHOWN. If set to TRUE, it's HIDDEN.
          // To make it hidden by default, we just need to ensure the rendering check is inverted.
          // The cleanest way is to use the !! operator for a boolean check:

          // If hiddenImages[artworkId] is undefined (default), treat as HIDDEN (true).
          // Only show if hiddenImages[artworkId] is explicitly set to false.
          const isImageShown = hiddenImages[artworkId] === false;
          const isInfoShown = hiddenInfo[artworkId] === false;

          return (
            <div
              key={artworkId}
              className={`p-2 border ${borderColor} rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-1`}
            >
              <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                {artwork.title}
              </h3>

              {/* 💥 IMAGE TOGGLE BUTTON 💥 */}
              <button
                onClick={() => toggleImage(artworkId)}
                // The button text and color now depend on whether the item is SHOWN (isImageShown)
                className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                  isImageShown
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isImageShown ? "Hide Image" : "Show Image"}
              </button>

              {/* 💥 IMAGE BLOCK (CONDITIONAL RENDERING) 💥 */}
              {isImageShown &&
                ((
                  isHarvard ? artwork.primaryimageurl : artwork.images?.web?.url
                ) ? (
                  <img
                    src={
                      isHarvard
                        ? artwork.primaryimageurl
                        : artwork.images.web.url
                    }
                    className="rounded-lg object-cover w-full h-36"
                    width="400"
                    height="400"
                    alt={artwork.title || "Artwork"}
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-xs">No Image</p>
                  </div>
                ))}

              {/* 💥 INFO TOGGLE BUTTON 💥 */}
              <button
                onClick={() => toggleInfo(artworkId)}
                className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                  isInfoShown
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isInfoShown ? "Hide Info" : "Show Info"}
              </button>

              {/* 💥 INFO BLOCK (CONDITIONAL RENDERING) 💥 */}
              {isInfoShown && (
                <div className="text-xs w-full text-left p-1 space-y-0.5">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {isHarvard
                      ? artwork.begindate
                      : artwork.creation_date || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">By:</span>{" "}
                    {isHarvard
                      ? artwork.people?.[0]?.name || "N/A"
                      : artwork.creators?.[0]?.description || "N/A"}
                  </p>
                  <p className="line-clamp-2 text-gray-600 min-h-[1.5rem]">
                    <span className="font-semibold">Desc:</span>{" "}
                    {artwork.description || "No description provided."}
                  </p>
                  <div className="pt-1 text-center">
                    <a
                      href={artwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                    >
                      More details
                    </a>
                  </div>
                  <CollectionButton artwork={artwork} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls - BOTTOM */}
      {totalPages > 1 && <PaginationControls />}
    </section>
  );
};

// --- Main Component ---
export default function Combined() {
  // State to hold all fetched results (for client-side pagination)
  const [harvardFullData, setHarvardFullData] = useState([]);
  const [clevelandFullData, setClevelandFullData] = useState([]);

  // State for search terms and filters
  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [error, setError] = useState();

  // Pagination State
  const itemsPerPage = 15; // Set a reasonable number of items per page
  const [harvardCurrentPage, setHarvardCurrentPage] = useState(0); // 0-based index
  const [clevelandCurrentPage, setClevelandCurrentPage] = useState(0); // 0-based index

  const link = "/personalexhibition";
  const home_link = "/";

  const harvardSearch = () => {
    // Reset page to 0 on a new search
    setHarvardCurrentPage(0);
    setClevelandCurrentPage(0);
    setError(null);

    let harvard_before_year = "";
    if (beforeYear) {
      harvard_before_year = beforeYear + "-01-01";
    }

    // Use &size=100 (or more) to fetch enough data for client-side pagination
    let harvard_url = `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&size=100`;

    if (orderby) {
      harvard_url += `&orderby=${orderby}`;
    }

    if (harvard_before_year) {
      harvard_url += `&before=${harvard_before_year}`;
    }

    // --- Harvard API Call ---
    axios
      .get(harvard_url)
      .then((response) => {
        setHarvardFullData(response.data.records);
      })
      .catch((err) => {
        console.error("Harvard API error:", err);
        setError(
          "A network error occurred or the search query returned nothing from Harvard"
        );
        setHarvardFullData([]); // Clear results on error
      });

    // --- Cleveland API Logic and Call ---
    let cleveland_sort_value = "";
    switch (orderby) {
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

    // Use &limit=100 (or more) to fetch enough data for client-side pagination
    let cleveland_url = `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&limit=100`;

    if (cleveland_sort_value) {
      cleveland_url += `&sort=${cleveland_sort_value}`;
    }

    if (beforeYear) {
      cleveland_url += `&created_before=${beforeYear}`;
    }

    axios
      .get(cleveland_url)
      .then((response) => {
        setClevelandFullData(response.data.data);
      })
      .catch((err) => {
        console.error("Cleveland API error:", err);
        setError(
          "A network error occurred or the search query returned nothing from Cleveland"
        );
        setClevelandFullData([]); // Clear results on error
      });

    console.log("Search button clicked. Starting API call for:", term);
  };

  // --- Handle Page Change for ReactPaginate ---
  // This updates the state when NEXT/PREVIOUS or a page number is clicked.
  const handleHarvardPageClick = (event) => {
    setHarvardCurrentPage(event.selected);
  };

  const handleClevelandPageClick = (event) => {
    setClevelandCurrentPage(event.selected);
  };

  const addToCollectionHarvard = (harvardArtwork) => {
    console.log("added Harvard:", harvardArtwork.id);
    sessionStorage.setItem(harvardArtwork.id, JSON.stringify(harvardArtwork));
  };

  const addToCollectionCleveland = (clevelandArtwork) => {
    console.log("added Cleveland:", clevelandArtwork.id);
    sessionStorage.setItem(
      clevelandArtwork.id,
      JSON.stringify(clevelandArtwork)
    );
  };

  const harvardPageCount = Math.ceil(harvardFullData.length / itemsPerPage);
  const clevelandPageCount = Math.ceil(clevelandFullData.length / itemsPerPage);

  return (
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
            <option value="venues">Gallery</option>
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
        {/* Harvard Results - NOW USES PAGINATED ITEMS */}
        <PaginatedItems
          items={harvardFullData}
          currentPage={harvardCurrentPage}
          itemsPerPage={itemsPerPage}
          handlePageClick={handleHarvardPageClick}
          totalPages={harvardPageCount}
          title="Harvard Results"
          isHarvard={true}
          addToCollection={addToCollectionHarvard}
        />

        {/* Cleveland Results - NOW USES PAGINATED ITEMS */}
        <PaginatedItems
          items={clevelandFullData}
          currentPage={clevelandCurrentPage}
          itemsPerPage={itemsPerPage}
          handlePageClick={handleClevelandPageClick}
          totalPages={clevelandPageCount}
          title="Cleveland Results"
          isHarvard={false}
          addToCollection={addToCollectionCleveland}
        />
      </div>
    </div>
  );
}
