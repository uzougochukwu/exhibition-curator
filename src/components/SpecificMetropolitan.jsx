import React, { useEffect, useState } from "react";
import { fetchSpecificMetropolitan } from "../api";
import { useParams } from "react-router";



export default function SpecificMetropolitan() {
    const parameter = useParams();

    const [particularArtwork, setParticularArtwork] = useState([])

    const [isLoading, setIsLoading] = useState(true)
//console.log("here");

    useEffect(() => {
        fetchSpecificMetropolitan(parameter.objectID)
        .then((individualArtwork) => {
            
            setParticularArtwork(individualArtwork);
            setIsLoading(false);
        })
        .catch(console.log)
    }, [])

    if (isLoading) {
        return <p>Loading...</p>
    }


  return (<div>
    <p>Title: {particularArtwork.title} </p>
    <img src={particularArtwork.primaryImageSmall}></img>

  </div>);
}
