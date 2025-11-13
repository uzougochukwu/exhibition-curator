import React, { useEffect, useState, useCallback } from "react";
import harvard_api_key from "../extra/API-KEY";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificHarvard2() {
  const parameter = useParams();

  const home = "/";
  const search = "/combined";
  const personal_exhibition = "/personalexhibition";

  const [individualHarvard, setParticularHarvard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // MODIFIED STATE 1: isAddedToExhibition checks if the item is in permanent storage
  const [isAddedToExhibition, setIsAddedToExhibition] = useState(false);

  // MODIFIED STATE 2: showConfirmation controls the temporary "Added! 🎉" flash
  const [showConfirmation, setShowConfirmation] = useState(false);

  // --- Initial Check and Data Fetch ---
  useEffect(() => {
    const artworkId = parameter.artworkid;

    // 1. Check if the artwork is already in sessionStorage (PERMANENT CHECK)
    if (sessionStorage.getItem(artworkId)) {
      setIsAddedToExhibition(true);
    } else {
      setIsAddedToExhibition(false);
    }

    // 2. Fetch the artwork details
    // NOTE: This URL looks like it's fetching an *exhibition*, not a specific artwork (object).
    // I am keeping the original URL for functional consistency, but for single artwork details,
    // the endpoint is usually: `https://api.harvardartmuseums.org/object/${artworkId}?apikey=...`
    axios
      .get(
        `https://api.harvardartmuseums.org/exhibition/${artworkId}?apikey=${harvard_api_key}`
      )
      .then((response) => {
        setParticularHarvard(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Harvard artwork:", error);
        setIsLoading(false);
        setParticularHarvard(null);
      });
  }, [parameter.artworkid]);

  // MODIFIED FUNCTION: Uses useCallback and updates permanent/temporary states
  const handleAddToCollection = useCallback((artwork) => {
    // Prevent saving if already permanently added
    if (!artwork || isAddedToExhibition) return; 

    // 1. Save the item to sessionStorage
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


  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Handle case where data might not be found or fetch failed
  if (!individualHarvard) {
    return (
      <div style={{ textAlign: 'center' }}> {/* Added centering style here as well */}
        <p>Artwork not found or an error occurred.</p>
        <a href={search}>
          <button>Go to Search</button>
        </a>
      </div>
    );
  }

  // Determine the button text and state based on permanent and temporary status
  let buttonText = "Add to collection";
  let buttonDisabled = false;
  let buttonColor = '#4f46e5'; // Indigo

  if (isAddedToExhibition) {
    buttonText = "Added! ✅";
    buttonDisabled = true;
    buttonColor = '#4CAF50'; // Green
  } else if (showConfirmation) {
    buttonText = "Added! 🎉";
    buttonDisabled = true;
    buttonColor = '#4CAF50'; // Green
  }

  // --- MODIFICATION HERE: Added style prop to the outermost div ---
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centers children horizontally
        width: '100%', // Ensures the container spans full width
        padding: '20px'
      }}
    >
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

      {/* Artwork Details - Text content will be centered by 'alignItems: center' on the p tags */}
      <p>Title: {individualHarvard.title}</p>


      {individualHarvard.primaryimageurl && (
        <img
          src={individualHarvard.primaryimageurl}
          alt={individualHarvard.title || "Artwork image"}
          width="200"
          height="200"
        ></img>
      )}
      <p>Desc: {individualHarvard.description}</p>
      <p>Location:</p>
      <p>Street: 32 Quincy Street</p>
      <p>City: Cambridge</p>
      <p>State: MA</p>
      <a href={individualHarvard.url}>
        <p>Harvard Website</p>
      </a>

      {/* MODIFIED BUTTON SECTION */}
      <button
        onClick={() => {
          handleAddToCollection(individualHarvard);
        }}
        disabled={buttonDisabled} 
        style={{
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: buttonColor, 
            color: 'white',
            border: 'none',
            cursor: buttonDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}