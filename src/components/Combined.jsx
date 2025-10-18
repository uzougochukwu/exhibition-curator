import React, { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
// We no longer need to import ReactPaginate for the new UI
// import ReactPaginate from "react-paginate";

// NEW: Imports for React Grid Layout
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// FIX: Placeholder for API key
import harvard_api_key from "../extra/API-KEY";

// Wrap the ResponsiveReactGridLayout with WidthProvider
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// --- STANDALONE COMPONENT: PaginationControls ---
const PaginationControls = React.memo(
  ({
    currentPage,
    totalPages,
    handlePageClick,
    displayCurrentPage, // This is currentPage + 1
  }) => {
    if (totalPages <= 1) return null;

    // New handler for Previous button
    const goToPrevious = () => {
      if (currentPage > 0) {
        // Calls the same function signature as ReactPaginate would have
        handlePageClick({ selected: currentPage - 1 });
      }
    };

    // New handler for Next button
    const goToNext = () => {
      if (currentPage < totalPages - 1) {
        // Calls the same function signature as ReactPaginate would have
        handlePageClick({ selected: currentPage + 1 });
      }
    };

    const prevDisabled = currentPage === 0;
    const nextDisabled = currentPage === totalPages - 1;

    return (
      <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={prevDisabled}
          className={`px-3 py-1 rounded-lg text-sm transition duration-150 ${
            prevDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          &lt; Previous
        </button>

        {/* Page X of Y Display */}
        <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Page <span className="font-bold">{displayCurrentPage}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={nextDisabled}
          className={`px-3 py-1 rounded-lg text-sm transition duration-150 ${
            nextDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Next &gt;
        </button>
      </div>
    );
  }
);

// --- Helper Component for Rendering Artworks and Handling Pagination ---
const PaginatedItems = ({
  items,
  currentPage,
  itemsPerPage,
  // handlePageClick, // No longer needed here
  totalPages,
  title,
  isHarvard,
  addToCollection,
}) => {
  // HOOKS CALLED UNCONDITIONALLY AT THE TOP
  // REMOVED: const [hiddenInfo, setHiddenInfo] = useState({});

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  React.useEffect(() => {
    // REMOVED: setHiddenInfo({});
  }, [currentPage, items]);

  const layout = useMemo(() => {
    return currentItems.map((artwork, index) => {
      // Calculate row (y) and column (x) based on a 3-column layout
      return {
        i: String(artwork.id),
        x: index % 3,
        y: Math.floor(index / 3) * 12, // Increased height slightly since info is now always visible
        w: 1,
        h: 12,
        static: true, // Prevent dragging/resizing
      };
    });
  }, [currentItems]);
  // ------------------------------------------------------------------

  // --- Toggle Handlers ---
  // REMOVED: const toggleInfo = (id) => { ... }
  // -------------------------

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

  const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

  // Safe early exit is now AFTER all Hooks
  if (items.length === 0) {
    return null;
  }

  // const displayCurrentPage = currentPage + 1; // Now managed in Combined component

  return (
    <section>
      {/* Using ResponsiveReactGridLayout */}
      <div className="mt-4">
        <ResponsiveReactGridLayout
          layouts={{ lg: layout }} // Use the defined layout for the 'lg' breakpoint
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 }} // Force 3 columns across all breakpoints
          rowHeight={30} // Height of one grid unit in pixels
          margin={[20, 20]} // Spacing between items
        >
          {currentItems.map((artwork) => {
            const artworkId = String(artwork.id);

            // Using full API URL as requested in prior steps
            // CORRECTED: Using local paths for navigation
            const harvardPage =
              "/exhibition/" + artwork.id + `?apikey=${harvard_api_key}`;
            const clevelandPage = "/artworks/" + artwork.id;
            const detailUrl = isHarvard ? harvardPage : clevelandPage;

            return (
              // The key must match the 'i' property in the layout definition
              <div
                key={artworkId}
                // The style/positioning is handled by react-grid-layout,
                // we keep the content styling
                className={`p-4 border ${borderColor} rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-2 h-full w-full`}
              >
                <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                  {artwork.title}
                </h3>

                {/* IMAGE BLOCK (ALWAYS RENDERS) */}
                {(
                  isHarvard ? artwork.primaryimageurl : artwork.images?.web?.url
                ) ? (
                  // Wrap in a relative div to allow the link to cover the image
                  <div className="relative w-full h-20"> 
                    {/* The <a> tag uses absolute positioning to cover the image */}
                    <a
                      href={detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 block" // z-10 makes it clickable over the image
                      title={`View details for ${artwork.title}`}
                    >
                      {/* Empty anchor tag to make the area clickable */}
                    </a> 
                    <img
                      src={
                        isHarvard
                          ? artwork.primaryimageurl
                          : artwork.images.web.url
                      }
                      className="rounded-lg object-cover w-full h-20"
                      width="200"
                      height="200"
                      alt={artwork.title || "Artwork"}
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-xs">No Image</p>
                  </div>
                )}

                {/* REMOVED: INFO TOGGLE BUTTON */}

                {/* CollectionButton is now always visible */}
                <CollectionButton artwork={artwork} />

                {/* INFO BLOCK (NOW ALWAYS RENDERS) */}
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
                      {/* {artwork.description || "No description provided."} */}
                    </p>
                    <div className="pt-1 text-center">
                      <a
                        href={detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                      >
                        More details
                      </a>
                    </div>
                  </div>
              </div>
            );
          })}
        </ResponsiveReactGridLayout>
      </div>
    </section>
  );
};

// --- Main Component ---
export default function Combined() {
  // 🚩 FEATURE FLAG DEFINITION 🚩
  // Set this to 'true' to show the Cleveland page number indicator, 'false' to hide it.
  const SHOW_CLEVELAND_PAGE_INDICATOR = false;

  // REF: Create a ref to mark the top of the search results for scrolling
  const topRef = useRef(null);

  // State to hold all fetched results (for client-side pagination)
  const [harvardFullData, setHarvardFullData] = useState([]);
  const [clevelandFullData, setClevelandFullData] = useState([]);

  // State for search terms and filters
  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [error, setError] = useState(null); // Initialize as null for clearer check
  // NEW STATE for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const itemsPerPage = 15; // Set a reasonable number of items per page
  const [harvardCurrentPage, setHarvardCurrentPage] = useState(0); // 0-based index
  const [clevelandCurrentPage, setClevelandCurrentPage] = useState(0); // 0-based index

  const link = "/personalexhibition";
  const home_link = "/";

  // FUNCTION: Scroll to the top of the search results
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const harvardSearch = async () => {
    // 1. Setup: Reset states and show loading
    setHarvardCurrentPage(0);
    setClevelandCurrentPage(0);
    setError(null);
    setHarvardFullData([]);
    setClevelandFullData([]);
    setIsLoading(true); // START LOADING

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let harvard_before_year = "";
    if (beforeYear) {
      harvard_before_year = beforeYear + "-01-01";
    }
    let harvard_url = `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&size=100&hasimage=1`;

    if (orderby) {
      harvard_url += `&orderby=${orderby}`;
    }
    if (harvard_before_year) {
      harvard_url += `&before=${harvard_before_year}`;
    }

    // --- Cleveland API Logic and URL Setup ---
    let cleveland_sort_value = "";
    switch (orderby) {
      case "venues":
        cleveland_sort_value = "gallery";
        break;
      case "people":
        cleveland_sort_value = "artists";
        break;
      case "title":
        cleveland_sort_value = "title";
      default:
        cleveland_sort_value = "";
        break;
    }

    let cleveland_url = `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&limit=100&has_image=1`;
    if (cleveland_sort_value) {
      cleveland_url += `&sort=${cleveland_sort_value}`;
    }
    if (beforeYear) {
      cleveland_url += `&created_before=${beforeYear}`;
    }

    // 2. Execute Calls (using Promise.all for parallel fetching)
    try {
      const [harvardResponse, clevelandResponse] = await Promise.allSettled([
        axios.get(harvard_url),
        axios.get(cleveland_url),
      ]);

      let errorMessages = [];

      // Handle Harvard Result
      if (harvardResponse.status === 'fulfilled') {
        setHarvardFullData(harvardResponse.value.data.records || []);
      } else {
        console.error("Harvard API error:", harvardResponse.reason);
        errorMessages.push("Harvard Museum search failed or returned no results.");
      }

      // Handle Cleveland Result
      if (clevelandResponse.status === 'fulfilled') {
        setClevelandFullData(clevelandResponse.value.data.data || []);
      } else {
        console.error("Cleveland API error:", clevelandResponse.reason);
        errorMessages.push("Cleveland Museum search failed or returned no results.");
      }

      // Final Error Check
      if (errorMessages.length > 0) {
        // Only set the error state if there are actual issues
        setError(errorMessages.join(' ')); 
      }
      
      if (harvardResponse.status === 'fulfilled' && harvardResponse.value.data.records.length === 0 && 
          clevelandResponse.status === 'fulfilled' && clevelandResponse.value.data.data.length === 0) {
        setError("Your search returned no results from either museum.");
      }

    } catch (err) {
      // This catch block would primarily handle system-level network errors outside of the API calls
      console.error("System Network Error:", err);
      setError("A critical network error occurred during the search.");
    } finally {
      // 3. Cleanup: Stop loading regardless of success/failure
      setIsLoading(false); 
    }

    console.log("Search button clicked. Starting API call for:", term);
  };

  // --- Handle Page Change for Pagination ---
  const handleHarvardPageClick = useCallback((event) => {
    setHarvardCurrentPage(event.selected);
  }, []);

  const handleClevelandPageClick = useCallback((event) => {
    setClevelandCurrentPage(event.selected);
  }, []);

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
  const harvardDisplayPage = harvardCurrentPage + 1;
  const clevelandDisplayPage = clevelandCurrentPage + 1;

  // --- Render Logic ---
  const showResults = !isLoading && (harvardFullData.length > 0 || clevelandFullData.length > 0);
  const showNoResultsMessage = !isLoading && !error && harvardFullData.length === 0 && clevelandFullData.length === 0;

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
          <p></p>
          <a href={link}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
              Go to Personal Exhibition
            </button>
          </a>
        </div>
      </header>
      <p></p>
      {/* Search/Filter Controls */}
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
            disabled={isLoading} // Disable input while searching
          />
        </div>
        <p></p>
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
            disabled={isLoading} // Disable input while searching
          >
            <option value="">No sort</option>
            <option value="artists">artists</option>
            <option value="title">title</option>
          </select>
        </div>
        <p></p>

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
            disabled={isLoading} // Disable input while searching
          />
        </div>
        <p></p>
        <button
          onClick={harvardSearch}
          disabled={isLoading} // Disable button while searching
          className={`w-full sm:w-auto px-6 py-2 font-semibold rounded-lg shadow-lg transition duration-150 transform ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
          }`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      <p></p>

      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <div className="text-red-700 p-3 bg-red-100 border border-red-300 rounded-lg font-medium">
          Error: {error}
        </div>
      )}

      {/* LOADING INDICATOR */}
      {isLoading && (
        <div className="flex justify-center items-center py-10 text-xl font-semibold text-gray-600">
          Searching... please wait.
        </div>
      )}

      {/* NO RESULTS MESSAGE */}
      {showNoResultsMessage && (
        <div className="flex justify-center items-center py-10 text-xl font-medium text-gray-500">
          No artworks found matching your criteria. Try a different search term.
        </div>
      )}

      {/* RESULTS SECTION (Only visible if not loading AND we have data) */}
      {showResults && (
        <div className="pt-4 space-y-8" ref={topRef}>
          {" "}
          {/* Ref marks the top */}
          {/* 1. ABSOLUTE TOP PAGE SELECTION: Harvard Only */}
          {/* Harvard Results Header */}
          {harvardPageCount > 1 && (
            <PaginationControls
              currentPage={harvardCurrentPage}
              totalPages={harvardPageCount}
              handlePageClick={handleHarvardPageClick}
              displayCurrentPage={harvardDisplayPage}
            />
          )}
          {/* Harvard Results Section */}
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
          {/* Cleveland Results Section */}
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
          {/* 2. ABSOLUTE BOTTOM PAGE SELECTION: Cleveland Only (Conditional on Feature Flag) */}
          {SHOW_CLEVELAND_PAGE_INDICATOR && clevelandPageCount > 1 && (
            <PaginationControls
              currentPage={clevelandCurrentPage}
              totalPages={clevelandPageCount}
              handlePageClick={handleClevelandPageClick}
              displayCurrentPage={clevelandDisplayPage}
            />
          )}
          {/* 3. SCROLL BACK TO TOP BUTTON */}
          {(harvardFullData.length > 0 || clevelandFullData.length > 0) && (
            <div className="flex justify-center pt-8">
              <button
                onClick={scrollToTop}
                className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
              >
                Back to Top of Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}