import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificCleveland() {
  const parameter = useParams();

  const [individualCleveland, setParticularCleveland] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/openaccess-api.clevelandart.org/api/artworks/${parameter.artworkid}`
      )
      .then((individualCleveland) => {
        console.log(individualCleveland.data.data);

        setParticularCleveland(individualCleveland.data.data);
      });
  }, [parameter.artworkid]);

  return (
    <div>
      <p>Title: {individualCleveland.title}</p>
    </div>
  );
}
