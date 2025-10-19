import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificCleveland() {
  const parameter = useParams();

  const home = "/";
  const search = "/combined";
  const personal_exhibition = "/personalexhibition";

  const [individualCleveland, setParticularCleveland] = useState(null); // Use null for initial state
  const [isLoading, setIsLoading] = useState(true);
  // NEW STATE: To control the confirmation message
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://openaccess-api.clevelandart.org/api/artworks/${parameter.artworkid}`
      )
      .then((response) => {
        console.log(response.data.data);
        setParticularCleveland(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Cleveland artwork:", error);
        setIsLoading(false);
        setParticularCleveland(null); // Ensure null if fetch fails
      });
  }, [parameter.artworkid]);

  // MODIFIED FUNCTION: Includes setting confirmation state and timeout
  const handleAddToCollection = (artwork) => {
    if (!artwork || isAdded) return; // Prevent double-clicking

    // 1. Save the item to sessionStorage
    console.log("added Cleveland:", artwork.id);
    sessionStorage.setItem(
      artwork.id,
      JSON.stringify(artwork)
    );

    // 2. Show the confirmation message
    setIsAdded(true);

    // 3. Hide the confirmation message after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Handle case where data might not be found or fetch failed
  if (!individualCleveland) {
    return (
      <div>
        <p>Artwork not found or an error occurred.</p>
        <a href={search}><button>Go to Search</button></a>
      </div>
    );
  }

  return (
    <div>
      <a href={home}>
        <button>Home</button>
      </a>
      <p></p>
      <a href={search}>
        <button>Search</button>
      </a>
      <p>
        <a href={personal_exhibition}>
          <button>Personal Exhibition</button>
        </a>
      </p>
      {/* Artwork Details */}
      <p>Title: {individualCleveland.title}</p>
      <p>Desc: {individualCleveland.description}</p>
      {individualCleveland.images?.web?.url && (
        <img src={individualCleveland.images.web.url} alt={individualCleveland.title || "Artwork image"} />
      )}
      <p>Location: </p>
      <p>Street: 11150 East Blvd</p>
      <p>City: Cleveland</p>
      <p>State: OH</p>
      
      {/* MODIFIED BUTTON SECTION */}
      <button
        onClick={() => {
          handleAddToCollection(individualCleveland);
        }}
        disabled={isAdded} // Disable while showing "Added!"
        // Optional: Add styling for visual feedback (e.g., green on added)
        // style={{ backgroundColor: isAdded ? 'green' : 'orange', color: 'white' }}
      >
        {isAdded ? "Added! 🎉" : "Add to collection"}
      </button>
    </div>
  );
}