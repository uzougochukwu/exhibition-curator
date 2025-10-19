import React, { useEffect, useState } from "react";
import harvard_api_key from "../extra/API-KEY";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificHarvard2() {
  const parameter = useParams();

  const home = "/"
  const search = "/combined"
  const personal_exhibition = "/personalexhibition"

  const [individualHarvard, setParticularHarvard] = useState(null); // Changed to null for better loading checks
  const [isLoading, setIsLoading] = useState(true)
  
  // NEW STATE: To control the confirmation message
  const [isAdded, setIsAdded] = useState(false); 

  useEffect(() => {
    axios
      .get(
        `https://api.harvardartmuseums.org/exhibition/${parameter.artworkid}?apikey=${harvard_api_key}`
      )
      .then((response) => { // Use response for clarity
        console.log(response.data);
        // Note: Accessing venues[0].city might fail if venues is empty.
        // It's safer to check the actual data structure or handle it in the return block.
        setParticularHarvard(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Harvard artwork:", error);
        setIsLoading(false);
        setParticularHarvard(null); // Set to null on error
      });
  }, [parameter.artworkid]);

  if (isLoading) {
    return <p>Loading...</p>;
  }  
  
  // Handle case where data might not be found or fetch failed
  if (!individualHarvard) {
    return (
      <div>
        <p>Artwork not found or an error occurred.</p>
        <a href={search}><button>Go to Search</button></a>
      </div>
    );
  }

  // MODIFIED FUNCTION: Includes setting confirmation state and timeout
  const handleAddToCollection = (artwork) => {
    if (!artwork || isAdded) return; // Prevent double-clicking

    // 1. Save the item to sessionStorage
    console.log("added Harvard:", artwork.id);
    sessionStorage.setItem(artwork.id, JSON.stringify(artwork));

    // 2. Show the confirmation message
    setIsAdded(true);

    // 3. Hide the confirmation message after 2 seconds (2000ms)
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); 
  };

  return (
    <div>
      <a href={home}>
        <button>Home</button>
      </a><p></p>
      <a href={search}>
        <button>Search</button>
      </a>
      <p><a href={personal_exhibition}><button>Personal Exhibition</button></a></p>
      
      {/* Artwork Details */}
      <p>Title: {individualHarvard.title}</p>
      <p>Desc: {individualHarvard.description}</p>
      
      {individualHarvard.primaryimageurl && (
          <img src={individualHarvard.primaryimageurl} alt={individualHarvard.title || "Artwork image"}></img>
      )}
      
      <p>Location:</p>
      {/* <p>Street: {individualHarvard.venues?.[0]?.address1}</p>
      <p>City: {individualHarvard.venues?.[0]?.city}</p>
      <p>State: {individualHarvard.venues?.[0]?.state}</p> */}
      <p>Street: 32 Quincy Street</p>
      <p>City: Cambridge</p>
      <p>State: MA</p>
      
      {/* MODIFIED BUTTON SECTION */}
      <button 
        onClick={()=> {handleAddToCollection(individualHarvard)}}
        disabled={isAdded} // Disable while showing "Added!"
        // Optional inline styling for a green confirmation look
        // style={{ 
        //     padding: '8px 16px',
        //     borderRadius: '4px',
        //     backgroundColor: isAdded ? '#4CAF50' : '#4f46e5', // Green for added, Indigo for default
        //     color: 'white',
        //     border: 'none',
        //     cursor: isAdded ? 'default' : 'pointer'
        // }}
      >
        {/* Conditional text display */}
        {isAdded ? "Added! 🎉" : "Add to collection"}
      </button>

    </div>
  );
}