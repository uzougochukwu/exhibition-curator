import React from "react";


export default function PersonalExhibition() {

  const storedData = sessionStorage.getItem(131669);
  const storedArray = storedData.forEach(element => {element.key    
  }
);



  const parsedData = JSON.parse(storedData);

  return (
    <div>PersonalExhibition
      <p key={parsedData.id}>
        {" "}
        {parsedData.title} <img src={parsedData.images?.web?.url}></img>
      </p>
      
    </div>
  );
}
