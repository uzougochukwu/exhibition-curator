import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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

// --- MODIFIED STANDALONE COMPONENT: PaginationControls (Renamed and Wrapped) ---
const BasePaginationControls = React.memo(
  ({
    currentPage,
    totalPages,
    handlePageClick,
    displayCurrentPage, // This is currentPage + 1
  }) => {
    if (totalPages <= 1) return null;

    const goToPrevious = () => {
      if (currentPage > 0) {
        handlePageClick({ selected: currentPage - 1 });
      }
    };

    const goToNext = () => {
      if (currentPage < totalPages - 1) {
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

// --- NEW COMPONENT: LabeledPaginationControls ---
// This component wraps the base controls with a label and a visual divider.
const LabeledPaginationControls = ({ label, ...props }) => {
    if (props.totalPages <= 1) return null;

    // Determine the border color based on the label for visual grouping
    const borderColor = label.includes('Harvard') ? 'border-blue-400' : 'border-orange-400';

    return (
        <div className={`pt-4 border-t-2 ${borderColor} mt-8`}>
            <p className="text-lg font-semibold text-center mb-2">
                {label} Page Selector
            </p>
            <BasePaginationControls {...props} />
        </div>
    );
};

// --- Helper Component for Rendering Artworks and Handling Pagination (SLIGHTLY MODIFIED) ---
const PaginatedItems = ({
  items,
  currentPage,
  itemsPerPage,
  totalPages,
  title,
  isHarvard,
  addToCollection, // The base function to save the item
}) => {
  // NEW STATE: Tracks the IDs of items that were recently added (for visual feedback)
  const [addedState, setAddedState] = useState({});

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  // Clear the addedState when the page changes
  React.useEffect(() => {
    setAddedState({});
  }, [currentPage, items]);

  // NEW: Handler that calls the parent function and sets the "Added!" state
  const handleAddToCollection = useCallback((artwork) => {
    // 1. Save the item via the parent function
    addToCollection(artwork);

    // 2. Set the "Added!" status for this item ID
    const artworkId = String(artwork.id);
    setAddedState(prev => ({
      ...prev,
      [artworkId]: true,
    }));

    // 3. Clear the status after 2 seconds
    setTimeout(() => {
      setAddedState(prev => ({
        ...prev,
        [artworkId]: false, // Set back to false or remove key
      }));
    }, 2000);
  }, [addToCollection]);


  // 1. MODIFIED useMemo to create a responsive layout object
  const layouts = useMemo(() => {
    const lgLayout = currentItems.map((artwork, index) => {
      // 3-column layout for 'lg' and 'md'
      return {
        i: String(artwork.id),
        x: index % 3,
        y: Math.floor(index / 3) * 12, // Increased height slightly since info is now always visible
        w: 1,
        h: 12,
        static: true, // Prevent dragging/resizing
      };
    });

    const smLayout = currentItems.map((artwork, index) => {
      // 2-column layout for 'sm'
      return {
        i: String(artwork.id),
        x: index % 2,
        y: Math.floor(index / 2) * 12,
        w: 1,
        h: 12,
        static: true,
      };
    });

    const xsLayout = currentItems.map((artwork, index) => {
      // 1-column layout for 'xs' and 'xxs' (mobile)
      return {
        i: String(artwork.id),
        x: 0, // Always column 0
        y: index * 12, // Stack vertically
        w: 1,
        h: 12,
        static: true,
      };
    });

    return {
      lg: lgLayout, // Large (default)
      md: lgLayout, // Medium
      sm: smLayout, // Small (tablet)
      xs: xsLayout, // Extra small (mobile)
      xxs: xsLayout, // Tiny
    };
  }, [currentItems]);
  // ------------------------------------------------------------------

  // MODIFIED CollectionButton to use addedState
  const CollectionButton = isHarvard
    ? ({ artwork }) => {
        const artworkId = String(artwork.id);
        const isAdded = addedState[artworkId];

        return (
          <button
            onClick={() => handleAddToCollection(artwork)}
            className={`mt-2 w-full px-3 py-1 text-white text-xs font-semibold rounded-lg transition duration-150 ${
              isAdded
                ? "bg-green-500 hover:bg-green-600" // Green for success
                : "bg-blue-500 hover:bg-blue-600" // Blue for default
            }`}
            disabled={isAdded} // Disable button while showing confirmation
          >
            {isAdded ? "Added! 🎉" : "Add to collection"}
          </button>
        );
      }
    : ({ artwork }) => {
        const artworkId = String(artwork.id);
        const isAdded = addedState[artworkId];

        return (
          <button
            onClick={() => handleAddToCollection(artwork)}
            className={`mt-2 w-full px-3 py-1 text-white text-xs font-semibold rounded-lg transition duration-150 ${
              isAdded
                ? "bg-green-500 hover:bg-green-600" // Green for success
                : "bg-orange-500 hover:bg-orange-600" // Orange for default
            }`}
            disabled={isAdded} // Disable button while showing confirmation
          >
            {isAdded ? "Added! 🎉" : "Add to collection"}
          </button>
        );
      };

  const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

  // Safe early exit is now AFTER all Hooks
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Using ResponsiveReactGridLayout */}
      <div className="mt-4">
        <ResponsiveReactGridLayout
          layouts={layouts} // 2. Use the new responsive 'layouts' object
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          // 3. Define the column count for each breakpoint
          cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }} // 1 column on 'xs' and 'xxs'
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
                      // target="_blank"
                      // rel="noopener noreferrer"
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
                    <span className="font-semibold">From:</span>{" "}
                    {isHarvard ? "Harvard" : "Cleveland"}
                  </p>
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
                  {/* MODIFIED SECTION START: Conditionally render description */}
                  {artwork.description && (
                    <p className="line-clamp-2 text-gray-600 min-h-[1.5rem]">
                      {/* {artwork.description} */}
                    </p>
                  )}
                  {/* MODIFIED SECTION END */}
                  <div className="pt-1 text-center">
                    <a
                      href={detailUrl}
                      // target="_blank"
                      // rel="noopener noreferrer"
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

// --- Main Component: Home (MODIFIED TO REMOVE SEARCH CONTROLS) ---
export default function Home() {
  // REF: Create a ref to mark the top of the search results for scrolling
  const topRef = useRef(null);

  // State to hold all fetched results (for client-side pagination)
  const [harvardFullData, setHarvardFullData] = useState([]);
  const [clevelandFullData, setClevelandFullData] = useState([]);

  // State for search terms and filters
  // Search is defaulted to "tree" and is not modifiable by the user anymore.
  const [term, setTerm] = useState("tree"); 
  const [orderby, setOrderBy] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); 

  // Pagination State
  const itemsPerPage = 15;
  const [harvardCurrentPage, setHarvardCurrentPage] = useState(0);
  const [clevelandCurrentPage, setClevelandCurrentPage] = useState(0);

  const link = "/personalexhibition";
  const home_link = "/";
  const combined = "/combined"
  const flowers = "/flowerexamples"
  const mountains = "/mountainexamples"

  // FUNCTION: Scroll to the top of the search results
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // NEW HELPER FUNCTION to filter data by description
  const filterData = (data) => {
    return data.filter((item) => item.description); 
  };

  // --- DERIVED/FILTERED DATA ---
  const filteredHarvardData = useMemo(() => {
    return filterData(harvardFullData);
  }, [harvardFullData]);

  const filteredClevelandData = useMemo(() => {
    return filterData(clevelandFullData);
  }, [clevelandFullData]);
  // -----------------------------

  // Search function remains, but it relies on the internal 'term', 'orderby', and 'beforeYear' states,
  // which are fixed/uncontrollable by the user in the UI now.
  const harvardSearch = useCallback(async (currentTerm) => { 
    const search_term = currentTerm || term; 

    // 1. Setup: Reset states and show loading
    setHarvardCurrentPage(0);
    setClevelandCurrentPage(0);
    setError(null);
    setHarvardFullData([]);
    setClevelandFullData([]);
    setHasSearched(true);
    setIsLoading(true);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let harvard_before_year = "";
    if (beforeYear) {
      harvard_before_year = beforeYear + "-01-01";
    } 
    
    // Use search_term in the URL
    let harvard_url = `https://api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${search_term}&size=100&hasimage=1`;
    
    if (harvard_before_year) {
      harvard_url += `&before=${harvard_before_year}`;
    }

    // Use search_term in the URL
    let cleveland_url = `https://openaccess-api.clevelandart.org/api/artworks/?q=${search_term}&limit=100&has_image=1`;
    
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
      let harvardRecords = [];
      if (harvardResponse.status === "fulfilled") {
        harvardRecords = harvardResponse.value.data.records || [];
        // Sorting logic kept intact
        if (orderby === "title-A-first") {
          harvardRecords.sort((a, b) => (a.title > b.title ? 1 : -1));
        } else if (orderby === "title-Z-first") {
          harvardRecords.sort((a, b) => (a.title < b.title ? 1 : -1));
        } else if (orderby === "begindate-oldest") {
          harvardRecords.sort((a, b) => (a.begindate > b.begindate ? 1 : -1));
        } else if (orderby === "begindate-newest") {
          harvardRecords.sort((a, b) => (a.begindate < b.begindate ? 1 : -1));
        }

        setHarvardFullData(harvardRecords);
      } else {
        console.error("Harvard API error:", harvardResponse.reason);
        errorMessages.push(
          "Harvard Museum search failed or returned no results."
        );
      }

      // Handle Cleveland Result
      let clevelandRecords = [];
      if (clevelandResponse.status === "fulfilled") {
        clevelandRecords = clevelandResponse.value.data.data || [];
        // Sorting logic kept intact
        if (orderby === "title-A-first") {
          clevelandRecords.sort((a, b) => (a.title > b.title ? 1 : -1));
        } else if (orderby === "title-Z-first") {
          clevelandRecords.sort((a, b) => (a.title < b.title ? 1 : -1));
        } else if (orderby === "begindate-oldest") {
          clevelandRecords.sort((a, b) => (a.begindate > b.begindate ? 1 : -1));
        } else if (orderby === "begindate-newest") {
          clevelandRecords.sort((a, b) => (a.begindate < b.begindate ? 1 : -1));
        }

        setClevelandFullData(clevelandRecords);
      } else {
        console.error("Cleveland API error:", clevelandResponse.reason);
        errorMessages.push(
          "Cleveland Museum search failed or returned no results."
        );
      }

      // Final Error Check
      if (harvardRecords.length === 0 && clevelandRecords.length === 0) {
        setError(`Your search for '${search_term}' returned no results from either museum.`);
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" "));
      } else {
        const allDataFilteredOut =
          filterData(harvardRecords).length === 0 &&
          filterData(clevelandRecords).length === 0;
        if (allDataFilteredOut) {
          setError(
            "We found some artworks, but none of them had a complete description, so they couldn't be displayed."
          );
        }
      }
    } catch (err) {
      console.error("System Network Error:", err);
      setError("A critical network error occurred during the search.");
    } finally {
      // 3. Cleanup: Stop loading regardless of success/failure
      setIsLoading(false);
    }

    console.log("Search button clicked. Starting API call for:", search_term);
  }, [term, beforeYear, orderby, harvard_api_key]);


  // useEffect for initial search on load
  useEffect(() => {
    // Trigger the search with the default term "tree" when the component mounts
    harvardSearch("tree"); 
  }, [harvardSearch]); 


  // --- Handle Page Change for Pagination ---
  const handleHarvardPageClick = useCallback((event) => {
    setHarvardCurrentPage(event.selected);
  }, []);

  const handleClevelandPageClick = useCallback((event) => {
    setClevelandCurrentPage(event.selected);
  }, []);

  // Collection functions for saving data
  const addToCollectionHarvard = useCallback((harvardArtwork) => {
    console.log("saving Harvard:", harvardArtwork.id);
    sessionStorage.setItem(harvardArtwork.id, JSON.stringify(harvardArtwork));
  }, []);

  const addToCollectionCleveland = useCallback((clevelandArtwork) => {
    console.log("saving Cleveland:", clevelandArtwork.id);
    sessionStorage.setItem(
      clevelandArtwork.id,
      JSON.stringify(clevelandArtwork)
    );
  }, []);
  // END MODIFIED

  // Use filtered data for page calculations
  const harvardPageCount = Math.ceil(filteredHarvardData.length / itemsPerPage);
  const clevelandPageCount = Math.ceil(
    filteredClevelandData.length / itemsPerPage
  );
  const harvardDisplayPage = harvardCurrentPage + 1;
  const clevelandDisplayPage = clevelandCurrentPage + 1;

  // --- Render Logic ---
  const showResults =
    !isLoading &&
    (filteredHarvardData.length > 0 || filteredClevelandData.length > 0);

  const showNoResultsMessage =
    hasSearched &&
    !isLoading &&
    !error &&
    filteredHarvardData.length === 0 &&
    filteredClevelandData.length === 0;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto font-inter">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-700">Artworks Search</h1>
        <div className="space-x-2">
          {/* <a href={home_link}>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-150">
              Home
            </button>
          </a> */}
          <p></p>
          <a href={link}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
              Go to Personal Exhibition
            </button>
          </a>
          <a href={combined}>
            <button>Search Page</button>
          </a>
          <p>Examples of Personal Exhibitions:</p>
          <p></p>
          <a href={flowers}>Flowers</a>
          <p></p>
          <a href={mountains}>Mountains</a>
        </div>
      </header>
      
      {/* Search/Filter Controls (MODIFIED: CONTENT REMOVED) */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end">
        {/* All inputs and the search button are removed from the UI */}
        {/* Placeholder for the now-empty search area */}
        {/* <p className="text-sm font-medium text-gray-700">
            Current search term: **tree** (Automatic search on load)
        </p> */}
      </div>
      
      <p></p>

      {/* ERROR MESSAGE DISPLAY */}
      {error && hasSearched && (
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
          No artworks found matching your criteria.
        </div>
      )}

      {/* RESULTS SECTION */}
      {showResults && (
        <div className="pt-4 space-y-8" ref={topRef}>
          {" "}
          
          {/* 1. ABSOLUTE TOP PAGE SELECTION: Harvard Only */}
          {harvardPageCount > 1 && (
            <LabeledPaginationControls
              label="Harvard Art Museums"
              currentPage={harvardCurrentPage}
              totalPages={harvardPageCount}
              handlePageClick={handleHarvardPageClick}
              displayCurrentPage={harvardDisplayPage}
            />
          )}

          {/* Harvard Results Section */}
          <PaginatedItems
            items={filteredHarvardData} 
            currentPage={harvardCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={harvardPageCount}
            title="Harvard Results"
            isHarvard={true}
            addToCollection={addToCollectionHarvard}
          />
          
          {/* Cleveland Results Section */}
          <PaginatedItems
            items={filteredClevelandData} 
            currentPage={clevelandCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={clevelandPageCount}
            title="Cleveland Results"
            isHarvard={false}
            addToCollection={addToCollectionCleveland}
          />
          
          {/* 2. ABSOLUTE BOTTOM PAGE SELECTION: Cleveland Only */}
          {clevelandPageCount > 1 && (
            <LabeledPaginationControls
              label="Cleveland Museum of Art"
              currentPage={clevelandCurrentPage}
              totalPages={clevelandPageCount}
              handlePageClick={handleClevelandPageClick}
              displayCurrentPage={clevelandDisplayPage}
            />
          )}

          {/* 3. SCROLL BACK TO TOP BUTTON */}
          {(filteredHarvardData.length > 0 ||
            filteredClevelandData.length > 0) && (
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