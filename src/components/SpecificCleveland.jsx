import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function SpecificCleveland() {
  const parameter = useParams();

  const home = "/"

  const search = "/combined"

  const personal_exhibition = "/personalexhibition"

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
        <a href={home}>
        <button>
            Home
        </button>
        </a><p></p>
        <a href={search}>
            <button>
                Search
            </button>
            </a>
            <p><a href={personal_exhibition}><button>Personal Exhibition</button></a></p>
      
      <p>Title: {individualCleveland.title}</p>
      <p>Desc: {individualCleveland.description}</p>
      <img src={individualCleveland.images.web.url}></img>
      <p>Location: </p>
      <p>Street: 11150 East Blvd</p>
      <p>City: Cleveland</p>
      <p>State: OH</p>
    </div>
  );
}
