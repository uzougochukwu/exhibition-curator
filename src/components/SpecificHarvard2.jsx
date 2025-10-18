import React, { useEffect, useState } from "react";
import harvard_api_key from "../extra/API-KEY";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificHarvard2() {
  const parameter = useParams();

  const [individualHarvard, setParticularHarvard] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://api.harvardartmuseums.org/exhibition/${parameter.artworkid}?apikey=${harvard_api_key}`
      )
      .then((individualHarvard) => {
        console.log(individualHarvard.data);
        console.log(individualHarvard.data.venues[0].city)

        setParticularHarvard(individualHarvard.data);
      });
  }, [parameter.artworkid]);

  return (
    <div>
      <p>Title: {individualHarvard.title}</p>
      <p>Desc: {individualHarvard.description}</p>
      <img
      src={individualHarvard.primaryimageurl}></img>
      <p>Location:</p>
      <p>Street: {individualHarvard.venues[0].address1}</p>
      <p>City: {individualHarvard.venues[0].city}</p>
      <p>State: {individualHarvard.venues[0].state}</p>
    </div>
  );
}
