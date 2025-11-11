import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificCleveland() {
  const parameter = useParams();

  const home = "/";
  const search = "/combined";
  const personal_exhibition = "/personalexhibition";

  const [individualCleveland, setParticularCleveland] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // MODIFIED STATE: isAddedToExhibition checks if the item is in permanent storage
  const [isAddedToExhibition, setIsAddedToExhibition] = useState(false);

  // NEW STATE: To control the temporary confirmation message after clicking
  const [showConfirmation, setShowConfirmation] = useState(false);

  // --- Initial Check and Data Fetch ---
  useEffect(() => {
    const artworkId = parameter.artworkid;

    // 1. Check if the artwork is already in sessionStorage
    if (sessionStorage.getItem(artworkId)) {
      setIsAddedToExhibition(true);
    } else {
      setIsAddedToExhibition(false);
    }

    // 2. Fetch the artwork details
    axios
      .get(
        `https://openaccess-api.clevelandart.org/api/artworks/${artworkId}`
      )
      .then((response) => {
        setParticularCleveland(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Cleveland artwork:", error);
        setIsLoading(false);
        setParticularCleveland(null);
      });
  }, [parameter.artworkid]);

  // MODIFIED FUNCTION: Includes setting permanent and temporary states
  const handleAddToCollection = useCallback((artwork) => {
    if (!artwork || isAddedToExhibition) return; // Prevent saving if already added

    // 1. Save the item to sessionStorage
    console.log("added Cleveland:", artwork.id);
    sessionStorage.setItem(artwork.id, JSON.stringify(artwork));

    // 2. Set permanent state to true
    setIsAddedToExhibition(true);
    
    // 3. Set temporary confirmation state to true
    setShowConfirmation(true);

    // 4. Hide the temporary confirmation message after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000); 
  }, [isAddedToExhibition]);


  // --- Render Logic ---
  
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Handle case where data might not be found or fetch failed
  if (!individualCleveland) {
    return (
      <div>
        <p>Artwork not found or an error occurred.</p>
        <a href={search}>
          <button>Go to Search</button>
        </a>
      </div>
    );
  }

  // Determine the button text and state
  let buttonText = "Add to collection";
  let buttonDisabled = false;

  if (isAddedToExhibition) {
    buttonText = "Added! ✅";
    buttonDisabled = true;
  } else if (showConfirmation) {
    // This state only lasts for 2 seconds after a successful click
    buttonText = "Added! 🎉";
    buttonDisabled = true;
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
        <img
          src={individualCleveland.images.web.url}
          alt={individualCleveland.title || "Artwork image"}
        />
      )}
      <p>Location: </p>
      <p>Street: 11150 East Blvd</p>
      <p>City: Cleveland</p>
      <p>State: OH</p>
      <a href={individualCleveland.url}>
        <p>Cleveland Website</p>
      </a>

      {/* MODIFIED BUTTON SECTION */}
      <button
        onClick={() => {
          handleAddToCollection(individualCleveland);
        }}
        disabled={buttonDisabled} 
        style={{ 
          backgroundColor: isAddedToExhibition ? 'green' : (showConfirmation ? 'green' : 'orange'), 
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: buttonDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}