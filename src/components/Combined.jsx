import React, { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import harvard_api_key from "../extra/API-KEY";

// Wrap the ResponsiveReactGridLayout with WidthProvider
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// --- MODIFIED STANDALONE COMPONENT: PaginationControls ---
const BasePaginationControls = React.memo(
  ({
    currentPage,
    totalPages,
    handlePageClick,
    displayCurrentPage, 
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

        <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Page <span className="font-bold">{displayCurrentPage}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </div>

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
const LabeledPaginationControls = ({ label, ...props }) => {
    if (props.totalPages <= 1) return null;
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

// --- Helper Component for Rendering Artworks ---
const PaginatedItems = ({
  items, 
  currentPage,
  itemsPerPage,
  addToCollection, 
}) => {
  const [addedState, setAddedState] = useState({});

  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  React.useEffect(() => {
    setAddedState({});
  }, [currentPage, items]);

  const handleAddToCollection = useCallback((artwork) => {
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

  const layouts = useMemo(() => {
    const createLayout = (cols, items) => items.map((artwork, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          i: artwork.combinedId,
          x: col,
          y: row * 12, 
          w: 1,
          h: 12,
          static: true, 
        };
      });

    return {
      lg: createLayout(3, currentItems),
      md: createLayout(3, currentItems),
      sm: createLayout(2, currentItems),
      xs: createLayout(1, currentItems),
      xxs: createLayout(1, currentItems),
    };
  }, [currentItems]);
  
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

  if (items.length === 0) return null;

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

            const harvardPage = "/exhibition/" + artwork.id + `?apikey=${harvard_api_key}`;
            const clevelandPage = "/artworks/" + artwork.id;
            const detailUrl = isHarvard ? harvardPage : clevelandPage;
            const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

            const imageUrl = isHarvard 
                ? artwork.primaryimageurl 
                : artwork.images?.web?.url;

            const date = isHarvard 
                ? artwork.begindate 
                : artwork.creation_date || "Unknown";

            const creator = isHarvard
                ? artwork.people?.[0]?.name || "Unknown"
                : artwork.creators?.[0]?.description || "Unknown";

            return (
              <div
                key={artworkId}
                className={`p-4 border ${borderColor} rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-2 h-full w-full`}
              >
                <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                  {artwork.title}
                </h3>

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

// --- Main Component ---
export default function Combined() {
  const topRef = useRef(null);
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

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const filterData = (data) => {
    return data.filter((item) => item.description);
  };

  const harvardSearch = async () => {
    setCombinedCurrentPage(0);
    setError(null);
    setCombinedFullData([]);
    setHasSearched(true);
    setIsLoading(true);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let harvard_url = `https://api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&size=100&hasimage=1`;
    if (beforeYear) harvard_url += `&before=${beforeYear}-01-01`;

    let cleveland_url = `https://openaccess-api.clevelandart.org/api/artworks/?q=${term}&limit=100&has_image=1`;
    if (beforeYear) cleveland_url += `&created_before=${beforeYear}`;

    try {
      const [harvardResponse, clevelandResponse] = await Promise.allSettled([
        axios.get(harvard_url),
        axios.get(cleveland_url),
      ]);

      let hRecords = harvardResponse.status === "fulfilled" ? (harvardResponse.value.data.records || []) : [];
      let cRecords = clevelandResponse.status === "fulfilled" ? (clevelandResponse.value.data.data || []) : [];

      // Add source tags and unique IDs
      let taggedH = hRecords.map(item => ({ ...item, source: 'harvard', combinedId: `h-${item.id}` }));
      let taggedC = cRecords.map(item => ({ ...item, source: 'cleveland', combinedId: `c-${item.id}` }));

      // Filter based on your original requirement
      taggedH = filterData(taggedH);
      taggedC = filterData(taggedC);

      // --- Individual Sorting Logic ---
      const sortFn = (a, b) => {
        if (orderby === "title-A-first") return a.title > b.title ? 1 : -1;
        if (orderby === "title-Z-first") return a.title < b.title ? 1 : -1;
        
        const dateA = a.begindate || a.creation_date || 0;
        const dateB = b.begindate || b.creation_date || 0;
        
        if (orderby === "begindate-oldest") return dateA > dateB ? 1 : -1;
        if (orderby === "begindate-newest") return dateA < dateB ? 1 : -1;
        return 0;
      };

      if (orderby !== "") {
        taggedH.sort(sortFn);
        taggedC.sort(sortFn);
      }

      // --- INTERLEAVING LOGIC (Harvard then Cleveland) ---
      let interleaved = [];
      const maxLength = Math.max(taggedH.length, taggedC.length);
      for (let i = 0; i < maxLength; i++) {
        if (i < taggedH.length) interleaved.push(taggedH[i]);
        if (i < taggedC.length) interleaved.push(taggedC[i]);
      }

      setCombinedFullData(interleaved);
      
      if (interleaved.length === 0) {
        setError("Your search returned no results from either museum.");
      }
    } catch (err) {
      setError("A critical network error occurred during the search.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCombinedPageClick = useCallback((event) => {
    setCombinedCurrentPage(event.selected);
  }, []);

  const addToCollection = useCallback((artwork) => {
    sessionStorage.setItem(artwork.combinedId, JSON.stringify(artwork));
  }, []);

  const combinedPageCount = Math.ceil(combinedFullData.length / itemsPerPage);

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Monet, landscapes"
            disabled={isLoading} 
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={orderby}
            onChange={(e) => setOrderBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading} 
          >
            <option value="">Relevance</option>
            <option value="begindate-oldest">Date Created - oldest to newest</option>
            <option value="begindate-newest">Date Created - newest to oldest</option>
            <option value="title-A-first">Title A - Z</option>
            <option value="title-Z-first">Title Z - A</option>
          </select>
        </div>
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Made before year:</label>
          <input
            type="text"
            value={beforeYear}
            onChange={(e) => setBeforeYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 2020"
            disabled={isLoading} 
          />
        </div>
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

      {error && hasSearched && (
        <div className="text-red-700 p-3 bg-red-100 border border-red-300 rounded-lg font-medium">
          Error: {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-10 text-xl font-semibold text-gray-600">
          Searching... please wait.
        </div>
      )}

      {!isLoading && hasSearched && combinedFullData.length > 0 && (
        <div className="pt-4 space-y-8" ref={topRef}>
          <LabeledPaginationControls
            label="Combined Search Results"
            currentPage={combinedCurrentPage}
            totalPages={combinedPageCount}
            handlePageClick={handleCombinedPageClick}
            displayCurrentPage={combinedCurrentPage + 1}
          />

          <PaginatedItems
            items={combinedFullData} 
            currentPage={combinedCurrentPage}
            itemsPerPage={itemsPerPage}
            addToCollection={addToCollection}
          />
          
          <LabeledPaginationControls
            label="Combined Search Results"
            currentPage={combinedCurrentPage}
            totalPages={combinedPageCount}
            handlePageClick={handleCombinedPageClick}
            displayCurrentPage={combinedCurrentPage + 1}
          />

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