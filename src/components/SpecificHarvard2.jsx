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
        console.log(individualHarvard);

        setParticularHarvard(individualHarvard.data);
      });
  }, [parameter.artworkid]);

  return (
    <div>
      <p>Title: {individualHarvard.title}</p>
    </div>
  );
}
