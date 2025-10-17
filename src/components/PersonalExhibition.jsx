import React, { useState, useEffect, useCallback } from "react";

export default function PersonalExhibition() {
  const link = "/";

  const [collection, setCollection] = useState([]);

  // function to load the collection from sessionStorage
  // We use useCallback so it can be safely called inside useEffect and removeFromCollection
  const loadCollection = useCallback(() => {
    const artworks = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const storedItem = sessionStorage.getItem(key);

      try {
        const parsedArtwork = JSON.parse(storedItem);
        // Basic check to ensure it's a valid artwork object
        if (parsedArtwork && parsedArtwork.title && parsedArtwork.id) {
          artworks.push(parsedArtwork);
        }
      } catch (error) {
        console.error(
          `Error parsing sessionStorage item for key ${key}:`,
          error
        );
      }
    }
    setCollection(artworks);
  }, []); // empty dependency array means this function is only created once

  useEffect(() => {
    // load the collection when the component mounts
    loadCollection();
  }, [loadCollection]);

  // function to remove an artwork from sessionStorage and refresh the display
  const removeFromCollection = (artworkId) => {
    // 1. Delete the item from sessionStorage using its ID as the key
    sessionStorage.removeItem(artworkId);

    // 2. Refresh the display by re-loading the entire collection
    loadCollection();
  };

  if (collection.length === 0) {
    return (
      <div>
        <h2>Personal Exhibition</h2>
        <p>Your personal exhibition is empty. Add some artworks!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Personal Exhibition</h2>
      <a href={link}>
        <button> Go to the Home page</button>
      </a>
      {collection.map((artwork) => (
        <div
          key={artwork.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{artwork.title}</h3>
          <p>{artwork.department}</p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {artwork.begindate || artwork.creation_date || "N/A"}
          </p>
          <p>
                      <span className="font-semibold">By:</span>{" "}
                      {
                        artwork.people?.[0]?.name || artwork.creators?.[0]?.description || "N/A"}
                    </p>
          <img
            src={artwork.primaryimageurl}
            // alt={artwork.title}
            style={{
              maxWidth: "200px",
              height: "150px",
              display: "block",
              marginBottom: "10px",
            }}
          />
          <img
            src={artwork.images?.web?.url}
            // alt={artwork.title}
            style={{
              maxWidth: "200px",
              height: "150px",
              display: "block",
              marginBottom: "10px",
            }}
          />
                              <div className="pt-1 text-center">
                      <a
                        //href={artwork.url}
                        href={`https://www.google.com/search?q=${artwork.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                      >
                        More details
                      </a>
                    </div>

          {/* 3. Add the Delete button and bind it to removeFromCollection */}
          <button onClick={() => removeFromCollection(artwork.id)}>
            Delete from Collection
          </button>
        </div>
      ))}
    </div>
  );
}
