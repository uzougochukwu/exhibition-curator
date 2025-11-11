import React from "react";
import Harvard from "./Harvard";
import Metropolitan from "./Metropolitan";
import Metropolitan2 from "./Metropolitan2";
function Home() {
  const cleveland_link = "/cleveland";
  const personal_exhibition = "/personalexhibition";
  const smithsonian_link = "/smithsonian";
  const combined = "/combined";
  const defaulthome = "/defaulthome"

  return (
    <div>
      <h1>My Exhibition</h1>
      <p>Welcome to your own personal exhibition</p>
      <p>
        If you click on the search link, you can search the Harvard and
        Cleveland Museums for artworks
      </p>
      <p>If you like an artwork, save it by clicking 'Add to Collection'</p>
      <p>To view your saved artworks, go to your personal exhibition</p>
      <a href={personal_exhibition}>Personal Exhibition</a>
      <p></p>
      {/* <a href={cleveland_link}>Cleveland</a><p></p>
    <a href={smithsonian_link}>Smithsonian</a><p></p> */}
      <a href={combined}>Search</a><p></p>
      <a href={defaulthome}>Default</a>


      <p>
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Logo_Cleveland_Museum_of_Art.svg/1200px-Logo_Cleveland_Museum_of_Art.svg.png"
          }
          width="300"
          height="300"
        ></img>
      </p>

      <p>
        <img
          src={
            "https://www.harvardsquare.com/wp-content/uploads/2019/07/harvard-art-museums-logo.jpg"
          }
          width="300"
          height="300"
        ></img>
      </p>
    </div>
  );
}

export default Home;
