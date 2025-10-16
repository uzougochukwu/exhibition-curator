import React, { useState, useCallback, useMemo } from "react";
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
const PaginationControls = React.memo(({
  currentPage,
  totalPages,
  handlePageClick,
  displayCurrentPage // This is currentPage + 1
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
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
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
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        Next &gt;
      </button>
      
    </div>
  );
});

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
  // HOOKS CALLED UNCONDITIONALLY AT THE TOP
  const [hiddenImages, setHiddenImages] = useState({});
  const [hiddenInfo, setHiddenInfo] = useState({});

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  React.useEffect(() => {
    setHiddenImages({});
    setHiddenInfo({});
  }, [currentPage, items]);

  const layout = useMemo(() => {
    return currentItems.map((artwork, index) => {
      // Calculate row (y) and column (x) based on a 3-column layout
      return {
        i: String(artwork.id),
        x: index % 3,
        y: Math.floor(index / 3) * 10, // Ensure enough height for content
        w: 1,
        h: 10, 
        static: true, // Prevent dragging/resizing
      };
    });
  }, [currentItems]);
  // ------------------------------------------------------------------

  // --- Toggle Handlers ---
  const toggleImage = (id) => {
    setHiddenImages(prev => ({
      ...prev,
      [id]: prev[id] === false ? undefined : false 
    }));
  };

  const toggleInfo = (id) => {
    setHiddenInfo(prev => ({
      ...prev,
      [id]: prev[id] === false ? undefined : false
    }));
  };
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

  const displayCurrentPage = currentPage + 1;


  return (
    <section>
      {/* Pagination Controls - TOP: KEPT (One control per result set at its top) */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
          displayCurrentPage={displayCurrentPage}
        />
      )}

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
            const isImageShown = hiddenImages[artworkId] === false;
            const isInfoShown = hiddenInfo[artworkId] === false;
            
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

                {/* IMAGE TOGGLE BUTTON */}
                <button
                  onClick={() => toggleImage(artworkId)}
                  className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                      isImageShown ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isImageShown ? 'Hide Image' : 'Show Image'}
                </button>

                {/* IMAGE BLOCK (CONDITIONAL RENDERING) */}
                {isImageShown && (
                  (isHarvard ? artwork.primaryimageurl : artwork.images?.web?.url) ? (
                    <img
                      src={
                        isHarvard ? artwork.primaryimageurl : artwork.images.web.url
                      }
                      className="rounded-lg object-cover w-full h-20"
                      width="400"
                      height="400"
                      alt={artwork.title || "Artwork"}
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-200 flex items-center justify-center rounded-lg">
                      <p className="text-gray-500 text-xs">No Image</p>
                    </div>
                  )
                )}

                {/* INFO TOGGLE BUTTON */}
                <button
                  onClick={() => toggleInfo(artworkId)}
                  className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                      isInfoShown ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isInfoShown ? 'Hide Info' : 'Show Info'}
                </button>

                {/* CollectionButton is now always visible */}
                <CollectionButton artwork={artwork} /> 

                {/* INFO BLOCK (CONDITIONAL RENDERING) */}
                {isInfoShown && (
                  <div className="text-xs w-full text-left p-1 space-y-0.5">
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {isHarvard ? artwork.begindate : artwork.creation_date || "N/A"}
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
                  </div>
                )}
              </div>
            )})}
        </ResponsiveReactGridLayout>
      </div>

      {/* Pagination Controls - BOTTOM: REMOVED */}
      {/* {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
          displayCurrentPage={displayCurrentPage}
        />
      )} */}
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
      </div>
    </div>
  );
}