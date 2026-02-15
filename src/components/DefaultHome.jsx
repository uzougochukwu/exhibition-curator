import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Helper remains if needed for local data later
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const BasePaginationControls = React.memo(({ currentPage, totalPages, handlePageClick, displayCurrentPage }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-2 sm:space-y-0 sm:space-x-4">
      <button
        onClick={() => handlePageClick({ selected: currentPage - 1 })}
        disabled={currentPage === 0}
        className={`px-3 py-1 rounded-lg text-sm transition ${currentPage === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
      >
        &lt; Previous
      </button>
      <div className="text-sm font-medium text-gray-700">
        Page <span className="font-bold">{displayCurrentPage}</span> of <span className="font-bold">{totalPages}</span>
      </div>
      <button
        onClick={() => handlePageClick({ selected: currentPage + 1 })}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-1 rounded-lg text-sm transition ${currentPage === totalPages - 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
      >
        Next &gt;
      </button>
    </div>
  );
});

const PaginatedItems = ({ items, currentPage, itemsPerPage, onArtworkAdded }) => {
  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  const layouts = useMemo(() => {
    const createLayout = (cols) => currentItems.map((artwork, index) => ({
      i: artwork.combinedId,
      x: index % cols,
      y: Math.floor(index / cols) * 12,
      w: 1,
      h: 12,
      static: true,
    }));
    return { lg: createLayout(3), md: createLayout(3), sm: createLayout(2), xs: createLayout(1), xxs: createLayout(1) };
  }, [currentItems]);

  // Returns empty grid as no items will be present in combinedData
  return (<div></div>
    // <ResponsiveReactGridLayout
    //   layouts={layouts}
    //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    //   cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
    //   rowHeight={30}
    //   margin={[20, 20]}
    // >
    //   {currentItems.map((artwork) => (
    //     <div key={artwork.combinedId}></div>
    //   ))}
    // </ResponsiveReactGridLayout>
  );
};

export default function DefaultHome() {
  const [combinedData, setCombinedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const itemsPerPage = 12;

  // API Logic removed. This function is now a no-op.
  const harvardSearch = () => {
    console.log("API calls are currently disabled.");
  };

  // Effect removed so no fetch happens on mount
  useEffect(() => { 
    /* Static mode: no data fetching */ 
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto font-inter">
      <header className="border-b-2 border-gray-100 pb-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Artworks Gallery</h1>
        <button onClick={harvardSearch} className="px-3 py-1 bg-gray-100 text-xs font-bold rounded">
          New Mix (Disabled)
        </button>
      </header>

      {/* Grid and results are hidden because combinedData is empty */}
      <div className="text-center py-20 text-gray-400">
        No artworks to display.
      </div>
    </div>
  );
}