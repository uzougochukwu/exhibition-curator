import React from 'react'
import Harvard from './Harvard'
import Metropolitan from './Metropolitan'
import Metropolitan2 from './Metropolitan2'
function Home() {

  const cleveland_link = "/cleveland"
  const personal_exhibition = "/personalexhibition"
  const smithsonian_link = "/smithsonian"
  const combined = "/combined"
  
  return (
    <div>
    <a href={personal_exhibition}>Personal Exhibition</a><p></p>
    {/* <a href={cleveland_link}>Cleveland</a><p></p>
    <a href={smithsonian_link}>Smithsonian</a><p></p> */}
    <a href={combined}>Search</a>
    </div>
  )
}

export default Home