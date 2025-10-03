import React, { useEffect, useState } from "react";
import searchMetropolitan from "../api";
import { useSearchParams } from "react-router-dom";

export default function Metropolitan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parameter = useSearchParams();
  let search_by = searchParams.get("search_by");
  
  //console.log(search_by);
  
  //const images = searchParams.get("hasImages");
  const images = true;

  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    //setSearchParams = event.target.value
    //search_by = event.target.value
    //console.log(event);
    setInputValue('')
  }

  const handleChange = (event) => {
    setInputValue(event.target.value)
    
    console.log(event.target.value);    
    
  }

  useEffect(() => {
    searchMetropolitan({ search_by})
      .then((metArtworks) => {
        setArtworks(metArtworks);
        setIsLoading(false);
      })
      .catch(console.log);
  }, [searchParams]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <div>
    <form onSubmit={handleSubmit}>
    <label htmlFor="myInput">Enter Search Text:</label>
      <input
        id="myInput"
        type="text"
        search_by={inputValue}
        onChange={handleChange}
        onClick={handleSubmit}
      />
       
      {/* The <button type="submit"> triggers the onSubmit event on the parent <form> 
        when clicked. */}
      
       <button type="submit">
        Submit Data 
      </button>

    </form>
    
    A list of the relevant Metropolitan artworks: {artworks.map((artwork) => {
      const link = "/objects/" + artwork
      // console.log(link);
      //console.log(search_by);
      
    return <p key={artwork}> {artwork}  <a href={link}>
      <button>Go to object</button>
      </a></p> 
  })} 
  </div>;
}
