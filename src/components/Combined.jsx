import React, { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import harvard_api_key from "../extra/API-KEY";

// Wrap the ResponsiveReactGridLayout with WidthProvider
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// --- MODIFIED STANDALONE COMPONENT: PaginationControls (Now uses combined props) ---
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

// --- NEW COMPONENT: LabeledPaginationControls (Simplified for combined list) ---
const LabeledPaginationControls = ({ label, ...props }) => {
    if (props.totalPages <= 1) return null;

    // Use a neutral color since it controls the whole list
    const borderColor = 'border-indigo-400';

    return (
        <div className={`pt-4 border-t-2 ${borderColor} mt-8`}>
            <p className="text-lg font-semibold text-center mb-2">
                {label} Page Selector
            </p>
            <BasePaginationControls {...props} />
        </div>
    );
};

// --- Helper Component for Rendering Artworks and Handling Pagination (MODIFIED FOR COMBINED DATA) ---
const PaginatedItems = ({
  items, // Now the COMBINED array
  currentPage,
  itemsPerPage,
  // Removed totalPages as it's passed below, but keeping it in props for cleanliness
  // Removed isHarvard, title as they are now derived from the item's 'source'
  addToCollection, // The base function to save the item (now handles any item)
}) => {
  const [addedState, setAddedState] = useState({});

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  React.useEffect(() => {
    setAddedState({});
  }, [currentPage, items]);

  // Handler that calls the parent function and sets the "Added!" state
  const handleAddToCollection = useCallback((artwork) => {
    // We use the combinedId for state tracking
    const artworkId = artwork.combinedId; 
    
    addToCollection(artwork);

    setAddedState(prev => ({
      ...prev,
      [artworkId]: true,
    }));

    setTimeout(() => {
      setAddedState(prev => ({
        ...prev,
        [artworkId]: false,
      }));
    }, 2000);
  }, [addToCollection]);


  // MODIFIED useMemo to create a responsive layout object
  const layouts = useMemo(() => {
    const createLayout = (cols, items) => items.map((artwork, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          i: artwork.combinedId, // Use the combinedId
          x: col,
          y: row * 12, 
          w: 1,
          h: 12,
          static: true, 
        };
      });

    return {
      lg: createLayout(3, currentItems), // Large (default)
      md: createLayout(3, currentItems), // Medium
      sm: createLayout(2, currentItems), // Small (tablet)
      xs: createLayout(1, currentItems), // Extra small (mobile)
      xxs: createLayout(1, currentItems), // Tiny
    };
  }, [currentItems]);
  
  // MODIFIED CollectionButton to derive colors from artwork.source
  const CollectionButton = ({ artwork }) => {
    const artworkId = artwork.combinedId;
    const isAdded = addedState[artworkId];
    const isHarvard = artwork.source === 'harvard';

    const defaultBg = isHarvard ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600";
    const addedBg = "bg-green-500 hover:bg-green-600";

    return (
      <button
        onClick={() => handleAddToCollection(artwork)}
        className={`mt-2 w-full px-3 py-1 text-white text-xs font-semibold rounded-lg transition duration-150 ${
          isAdded ? addedBg : defaultBg
        }`}
        disabled={isAdded}
      >
        {isAdded ? "Added! 🎉" : "Add to collection"}
      </button>
    );
  };

  // Safe early exit
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mt-4">
        <ResponsiveReactGridLayout
          layouts={layouts} 
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }} 
          rowHeight={30} 
          margin={[20, 20]} 
        >
          {currentItems.map((artwork) => {
            const isHarvard = artwork.source === 'harvard';
            const artworkId = artwork.combinedId;

            // Determine URL and border color based on source
            const harvardPage = "/exhibition/" + artwork.id + `?apikey=${harvard_api_key}`;
            const clevelandPage = "/artworks/" + artwork.id;
            const detailUrl = isHarvard ? harvardPage : clevelandPage;
            const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

            // Determine image URL
            const imageUrl = isHarvard 
                ? artwork.primaryimageurl 
                : artwork.images?.web?.url;

            // Determine date
            const date = isHarvard 
                ? artwork.begindate 
                : artwork.creation_date || "Unknown";

            // Determine Creator/Artist
            const creator = isHarvard
                ? artwork.people?.[0]?.name || "Unknown"
                : artwork.creators?.[0]?.description || "Unknown";


            return (
              <div
                key={artworkId} // Using combinedId here
                className={`p-4 border ${borderColor} rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-2 h-full w-full`}
              >
                <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                  {artwork.title}
                </h3>

                {/* IMAGE BLOCK */}
                {imageUrl ? (
                  <div className="relative w-full h-20">
                    <a
                      href={detailUrl}
                      className="absolute inset-0 z-10 block" 
                      title={`View details for ${artwork.title}`}
                    >
                    </a>
                    <img
                      src={imageUrl}
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

                <CollectionButton artwork={artwork} />

                {/* INFO BLOCK */}
                <div className="text-xs w-full text-left p-1 space-y-0.5">
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {isHarvard ? "Harvard" : "Cleveland"}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {date}
                  </p>
                  <p>
                    <span className="font-semibold">By:</span>{" "}
                    {creator}
                  </p>
                  {/* description is required for display, no need to check here */}
                  <div className="pt-1 text-center">
                    <a
                      href={detailUrl}
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

// --- Main Component (MODIFIED) ---
export default function Combined() {
  const topRef = useRef(null);

  // 🚩 UNIFIED STATE 🚩
  const [combinedFullData, setCombinedFullData] = useState([]);
  const [combinedCurrentPage, setCombinedCurrentPage] = useState(0); 

  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); 

  const itemsPerPage = 15; 
  const link = "/personalexhibition";
  const home_link = "/";

  // FUNCTION: Scroll to the top of the search results
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // NEW HELPER FUNCTION to filter data by description
  const filterData = (data) => {
    // Only display items that have a description (since this was a filter used before)
    return data.filter((item) => item.description);
  };

  // --- DERIVED/FILTERED DATA (UNIFIED) ---
  const filteredCombinedData = useMemo(() => {
    // Reset page on new filter applied to the same data set
    // setCombinedCurrentPage(0); // Removing reset to allow smooth filtering
    return filterData(combinedFullData);
  }, [combinedFullData]);
  // -----------------------------

  const harvardSearch = async () => {
    // 1. Setup: Reset states and show loading
    setCombinedCurrentPage(0); // Reset unified page
    setError(null);
    setCombinedFullData([]); // Clear combined raw data
    setHasSearched(true);
    setIsLoading(true);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let harvard_before_year = "";
    if (beforeYear) {
      harvard_before_year = beforeYear + "-01-01";
    } 
    let harvard_url = `https://api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&size=100&hasimage=1`;
    
    if (harvard_before_year) {
      harvard_url += `&before=${harvard_before_year}`;
    }

    let cleveland_url = `https://openaccess-api.clevelandart.org/api/artworks/?q=${term}&limit=100&has_image=1`;
    
    if (beforeYear) {
      cleveland_url += `&created_before=${beforeYear}`;
    }

    // 2. Execute Calls (using Promise.allSettled for parallel fetching)
    try {
      const [harvardResponse, clevelandResponse] = await Promise.allSettled([
        axios.get(harvard_url),
        axios.get(cleveland_url),
      ]);

      let errorMessages = [];
      let harvardRecords = [];
      let clevelandRecords = [];

      // Handle Harvard Result
      if (harvardResponse.status === "fulfilled") {
        harvardRecords = harvardResponse.value.data.records || [];
      } else {
        console.error("Harvard API error:", harvardResponse.reason);
        errorMessages.push(
          "Harvard Museum search failed or returned no results."
        );
      }

      // Handle Cleveland Result
      if (clevelandResponse.status === "fulfilled") {
        clevelandRecords = clevelandResponse.value.data.data || [];
      } else {
        console.error("Cleveland API error:", clevelandResponse.reason);
        errorMessages.push(
          "Cleveland Museum search failed or returned no results."
        );
      }
      
      // 🚩 COMBINING LOGIC START 🚩
      // 3. Add Source Tag and Combine
      const taggedHarvard = harvardRecords.map(item => ({
        ...item,
        source: 'harvard', 
        combinedId: `h-${item.id}` // Unique ID for combined list
      }));

      const taggedCleveland = clevelandRecords.map(item => ({
        ...item,
        source: 'cleveland', 
        combinedId: `c-${item.id}` // Unique ID for combined list
      }));

      let combinedRecords = taggedHarvard.concat(taggedCleveland);
      
      // 4. Sort the Combined List
      if (orderby === "title-A-first") {
        combinedRecords.sort((a, b) => (a.title > b.title ? 1 : -1));
      } else if (orderby === "title-Z-first") {
        combinedRecords.sort((a, b) => (a.title < b.title ? 1 : -1));
      } else if (orderby === "begindate-oldest") {
        // Use a consistent date field for sorting
        combinedRecords.sort((a, b) => {
          const dateA = a.begindate || a.creation_date;
          const dateB = b.begindate || b.creation_date;
          return (dateA > dateB ? 1 : -1)
        });
      } else if (orderby === "begindate-newest") {
        combinedRecords.sort((a, b) => {
          const dateA = a.begindate || a.creation_date;
          const dateB = b.begindate || b.creation_date;
          return (dateA < dateB ? 1 : -1)
        });
      }

      // 5. Final Checks and State Update
      setCombinedFullData(combinedRecords);
      // 🚩 COMBINING LOGIC END 🚩
      
      // Final Error Check based on combined data
      if (combinedRecords.length === 0) {
        setError("Your search returned no results from either museum.");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" "));
      } else {
        const allDataFilteredOut = filterData(combinedRecords).length === 0;
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
      setIsLoading(false);
    }
  };

  // --- Handle Page Change for Pagination (UNIFIED) ---
  const handleCombinedPageClick = useCallback((event) => {
    setCombinedCurrentPage(event.selected);
  }, []);

  // MODIFIED: Single save function that handles either type of artwork
  const addToCollection = useCallback((artwork) => {
    // We use the combinedId for saving to sessionStorage
    console.log(`saving artwork (${artwork.source}):`, artwork.combinedId);
    sessionStorage.setItem(artwork.combinedId, JSON.stringify(artwork));
  }, []);
  // END MODIFIED

  // Use filtered data for page calculations (UNIFIED)
  const combinedPageCount = Math.ceil(filteredCombinedData.length / itemsPerPage);
  const combinedDisplayPage = combinedCurrentPage + 1;

  // --- Render Logic ---
  const showResults =
    !isLoading &&
    filteredCombinedData.length > 0;

  const showNoResultsMessage =
    hasSearched &&
    !isLoading &&
    !error &&
    filteredCombinedData.length === 0;

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
      {/* Search/Filter Controls (Unchanged) */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end">
        <div className="flex-grow">
          <label
            htmlFor="search-term"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Term &nbsp;
          </label>
          <input
            id="search-term"
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Monet, landscapes"
            disabled={isLoading} 
          />
        </div>
        <p></p>
        <p></p>
        <div className="w-full sm:w-1/4">
          <label
            htmlFor="sort-order"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By &nbsp;
          </label>
          <select
            id="sort-order"
            value={orderby}
            onChange={(e) => setOrderBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading} 
          >
            <option value="">Relevance</option>
            <option value="begindate-oldest">
              Date Created - oldest to newest
            </option>
            <option value="begindate-newest">
              Date Created - newest to oldest
            </option>
            <option value="title-A-first">Title A - Z</option>
            <option value="title-Z-first">Title Z - A</option>
          </select>
        </div>
        <p></p>
        <p></p>

        <div className="flex-grow">
          <label
            htmlFor="before"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Made before year: &nbsp;
          </label>
          <input
            id="before"
            type="text"
            value={beforeYear}
            onChange={(e) => setBeforeYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 2020"
            disabled={isLoading} 
          />
        </div>
        <p></p>
        <button
          onClick={harvardSearch}
          disabled={isLoading} 
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
          No artworks found matching your criteria. Try a different search term.
        </div>
      )}

      {/* RESULTS SECTION (UNIFIED) */}
      {showResults && (
        <div className="pt-4 space-y-8" ref={topRef}>
          {" "}
          
          {/* 1. TOP PAGE SELECTION: UNIFIED */}
          <LabeledPaginationControls
            label="Combined Search Results"
            currentPage={combinedCurrentPage}
            totalPages={combinedPageCount}
            handlePageClick={handleCombinedPageClick}
            displayCurrentPage={combinedDisplayPage}
          />

          {/* Combined Results Section */}
          <PaginatedItems
            items={filteredCombinedData} 
            currentPage={combinedCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={combinedPageCount}
            addToCollection={addToCollection}
          />
          
          {/* 2. BOTTOM PAGE SELECTION: UNIFIED */}
          <LabeledPaginationControls
            label="Combined Search Results"
            currentPage={combinedCurrentPage}
            totalPages={combinedPageCount}
            handlePageClick={handleCombinedPageClick}
            displayCurrentPage={combinedDisplayPage}
          />

          {/* 3. SCROLL BACK TO TOP BUTTON */}
          <div className="flex justify-center pt-8">
            <button
              onClick={scrollToTop}
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
            >
              Back to Top of Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}