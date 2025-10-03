import axios from "axios";
import { useParams } from "react-router-dom";

export default function searchMetropolitan(params) {
  return axios
    .get(`http://localhost:8080/collectionapi.metmuseum.org/public/collection/v1/search`, {
      params: {
        q: params.search_by,
        hasImages: true
      },
    })
    .then((response) => {
      //console.log(response.data["objectIDs"], response.data);

      return response.data["objectIDs"];
    });
}


function fetchSpecificMetropolitan(objectID) {
  return axios
    .get(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    )
    .then((response) => {
      console.log(response.data);
      // console.log(objectID);
      
      return response.data;
    });
}

export {fetchSpecificMetropolitan}
