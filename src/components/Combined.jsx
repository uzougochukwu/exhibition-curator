import React, { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import harvard_api_key from "../extra/API-KEY";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// --- Inlined PaginationControls ---
const PaginationControls = React.memo(
  ({ currentPage, totalPages, handlePageClick, displayCurrentPage }) => {
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

// --- Main Component ---
export default function Combined() {
  const topRef = useRef(null);

  const [harvardFullData, setHarvardFullData] = useState([]);
  const [clevelandFullData, setClevelandFullData] = useState([]);

  const [term, setTerm] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [error, setError] = useState();

  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(0); // Shared pagination

  const link = "/personalexhibition";
  const home_link = "/";

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const harvardSearch = () => {
    setCurrentPage(0);
    setError(null);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let harvard_before_year = beforeYear ? `${beforeYear}-01-01` : "";
    let harvard_url = `http://localhost:8080/api.harvardartmuseums.org/exhibition?apikey=${harvard_api_key}&q=${term}&size=100`;
    if (orderby) harvard_url += `&orderby=${orderby}`;
    if (harvard_before_year) harvard_url += `&before=${harvard_before_year}`;

    axios
      .get(harvard_url)
      .then((response) => {
        setHarvardFullData(response.data.records);
      })
      .catch((err) => {
        console.error("Harvard API error:", err);
        setError("Error from Harvard API or empty results.");
        setHarvardFullData([]);
      });

    let cleveland_sort_value = "";
    if (orderby === "venues") cleveland_sort_value = "gallery";
    if (orderby === "people") cleveland_sort_value = "artists";

    let cleveland_url = `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/?q=${term}&limit=100`;
    if (cleveland_sort_value) cleveland_url += `&sort=${cleveland_sort_value}`;
    if (beforeYear) cleveland_url += `&created_before=${beforeYear}`;

    axios
      .get(cleveland_url)
      .then((response) => {
        setClevelandFullData(response.data.data);
      })
      .catch((err) => {
        console.error("Cleveland API error:", err);
        setError("Error from Cleveland API or empty results.");
        setClevelandFullData([]);
      });
  };

  const handleCombinedPageClick = useCallback((event) => {
    setCurrentPage(event.selected);
  }, []);

  const addToCollection = (artwork) => {
    sessionStorage.setItem(artwork.id, JSON.stringify(artwork));
    console.log("Added:", artwork.id);
  };

  const renderPaginatedItems = (items, isHarvard) => {
    const offset = currentPage * itemsPerPage;
    const currentItems = items.slice(offset, offset + itemsPerPage);

    const [hiddenImages, setHiddenImages] = useState({});
    const [hiddenInfo, setHiddenInfo] = useState({});

    React.useEffect(() => {
      setHiddenImages({});
      setHiddenInfo({});
    }, [currentPage, items]);

    const layout = useMemo(() => {
      return currentItems.map((artwork, index) => ({
        i: String(artwork.id),
        x: index % 3,
        y: Math.floor(index / 3) * 10,
        w: 1,
        h: 10,
        static: true,
      }));
    }, [currentItems]);

    const toggleImage = (id) => {
      setHiddenImages((prev) => ({
        ...prev,
        [id]: prev[id] === false ? undefined : false,
      }));
    };

    const toggleInfo = (id) => {
      setHiddenInfo((prev) => ({
        ...prev,
        [id]: prev[id] === false ? undefined : false,
      }));
    };

    const borderColor = isHarvard ? "border-blue-200" : "border-orange-200";

    return (
      currentItems.length > 0 && (
        <div className="mt-4">
          <ResponsiveReactGridLayout
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 }}
            rowHeight={30}
            margin={[20, 20]}
          >
            {currentItems.map((artwork) => {
              const id = String(artwork.id);
              const isImageShown = hiddenImages[id] === false;
              const isInfoShown = hiddenInfo[id] === false;

              const imageUrl = isHarvard
                ? artwork.primaryimageurl
                : artwork.images?.web?.url;

              const title = artwork.title || "Untitled";

              return (
                <div
                  key={id}
                  className={`p-4 border ${borderColor} rounded-xl shadow-lg bg-white flex flex-col items-center text-center space-y-2 h-full w-full`}
                >
                  <h3 className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mt-1">
                    {title}
                  </h3>

                  <button
                    onClick={() => toggleImage(id)}
                    className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                      isImageShown
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isImageShown ? "Hide Image" : "Show Image"}
                  </button>

                  {isImageShown &&
                    (imageUrl ? (
                      <img
                        src={imageUrl}
                        className="rounded-lg object-cover w-full h-20"
                        alt={title}
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-200 flex items-center justify-center rounded-lg">
                        <p className="text-gray-500 text-xs">No Image</p>
                      </div>
                    ))}

                  <button
                    onClick={() => toggleInfo(id)}
                    className={`w-full py-1 text-xs font-semibold rounded-lg transition ${
                      isInfoShown
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isInfoShown ? "Hide Info" : "Show Info"}
                  </button>

                  {isInfoShown && (
                    <div className="text-xs text-left text-gray-700 w-full px-1">
                      {isHarvard ? (
                        <>
                          <p>
                            <strong>Venue:</strong>{" "}
                            {artwork.venues?.[0]?.name || "N/A"}
                          </p>
                          <p>
                            <strong>City:</strong>{" "}
                            {artwork.venues?.[0]?.city || "N/A"}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Department:</strong>{" "}
                            {artwork.department || "N/A"}
                          </p>
                          <p>
                            <strong>Gallery:</strong>{" "}
                            {artwork.gallery?.name || "N/A"}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => addToCollection(artwork)}
                    className="w-full py-1 text-xs font-bold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 mt-2"
                  >
                    Add to Personal Exhibition
                  </button>
                </div>
              );
            })}
          </ResponsiveReactGridLayout>
        </div>
      )
    );
  };

  const harvardPageCount = Math.ceil(harvardFullData.length / itemsPerPage);
  const clevelandPageCount = Math.ceil(clevelandFullData.length / itemsPerPage);
  const maxPageCount = Math.max(harvardPageCount, clevelandPageCount);

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

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Term
          </label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Monet, landscapes"
          />
        </div>

        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={orderby}
            onChange={(e) => setOrderBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">No sort</option>
            <option value="venues">Gallery</option>
          </select>
        </div>

        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Made before year:
          </label>
          <input
            type="text"
            value={beforeYear}
            onChange={(e) => setBeforeYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 2020"
          />
        </div>

        <button
          onClick={harvardSearch}
          className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="text-red-600 p-3 bg-red-100 border border-red-300 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Results */}
      <div className="pt-4 space-y-8" ref={topRef}>
        {/* Shared Pagination */}
        {maxPageCount > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={maxPageCount}
            handlePageClick={handleCombinedPageClick}
            displayCurrentPage={currentPage + 1}
          />
        )}

        {/* Harvard Results */}
        {renderPaginatedItems(harvardFullData, true)}

        {/* Cleveland Results */}
        {renderPaginatedItems(clevelandFullData, false)}

        {(harvardFullData.length > 0 || clevelandFullData.length > 0) && (
          <div className="flex justify-center pt-8">
            <button
              onClick={scrollToTop}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
            >
              Back to Top of Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
