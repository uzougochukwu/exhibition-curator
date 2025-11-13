import React, { useState, useEffect, useCallback } from "react";

export default function PersonalExhibition() {
  const link = "/";

  const search = "/combined";
    const flowers = "/flowerexamples"
  const mountains = "/mountainexamples"

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
        <a href={link}>
          <button> Go to the Home page</button>
        </a>

        <a href={search}>
          <button> Search</button>
        </a>
        <p>Example Exhibitions</p>
        <a href={flowers}>Flowers</a><p></p>
        <a href={mountains}>Mountains</a>
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
      <p>Example Exhibitions</p>
        <a href={flowers}>Flowers</a><p></p>
        <a href={mountains}>Mountains</a>
        <p>Your personal exhibition is empty. Add some artworks!</p>
      
      {collection.map((artwork) => (
        <div
          key={artwork.id}
          // style={{
          //   border: "1px solid #ccc",
          //   padding: "10px",
          //   margin: "10px auto", // Centering the entire record container
          //   maxWidth: "600px",
          // }}
        >
          <h3>{artwork.title}</h3>
          <p>{artwork.department}</p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {artwork.begindate || artwork.creation_date || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">By:</span>{" "}
            {artwork.people?.[0]?.name ||
              artwork.creators?.[0]?.description ||
              "N/A"}
          </p>
          {/* Image Container for Centering */}
          {/* style={{ textAlign: "center", margin: "10px 0" }} */}
          <div>
            {/* Harvard Image (using primaryimageurl) */}
            {artwork.primaryimageurl && (
              <img
                src={artwork.primaryimageurl}
                alt={artwork.title || "Harvard Artwork"}
                width="200"
                height="200"
                style={{
                  // maxWidth: "100%",
                  // height: "auto",
                  // maxHeight: "300px",
                  display: "inline-block", // Required for center alignment
                  marginBottom: "10px",
                }}
              />
            )}

            {/* Cleveland Image (using images.web.url) */}
            {artwork.images?.web?.url && (
              <img
                src={artwork.images.web.url}
                alt={artwork.title || "Cleveland Artwork"}
                width="200"
                height="200"
                style={{
                  // maxWidth: "100%",
                  // height: "auto",
                  // maxHeight: "300px",

                  display: "inline-block", // Required for center alignment
                  marginBottom: "10px",
                }}
              />
            )}
          </div>{" "}
          {/* End Image Container */}
          <p>Desc: </p>
          <p>{artwork.description}</p>
          <div className="pt-1 text-center">
            {/* More details link placeholder */}
          </div>
          <a href={artwork.url}><p>External Website </p></a>
          {/* 3. Add the Delete button and bind it to removeFromCollection */}
          <button onClick={() => removeFromCollection(artwork.id)}>
            Delete from Collection
          </button>
        </div>
      ))}
    </div>
  );
}
