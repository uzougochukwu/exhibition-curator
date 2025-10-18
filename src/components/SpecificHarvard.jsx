import React, { useEffect, useState } from "react";
import { fetchSpecificHarvard } from "../api";
import { useParams } from "react-router";

export default function SpecificHarvard() {

  const parameter = useParams();

  const [particularHarvard, setParticularHarvard] = useState([]);

  useEffect(() => {
    fetchSpecificHarvard(parameter.artworkid)
      .then((individualHarvard) => {
        console.log(parameter.artworkid);
        
        console.log(individualHarvard.data);
        
        setParticularHarvard(individualHarvard.data);
      })
      .catch(console.log);
  }, []);

  return (
    <div>
      <p>Title: {particularHarvard.title}</p>
    </div>
  );
}
