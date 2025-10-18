import React from 'react'
import { Link } from 'react-router'


function Navbar() {
  return(
 <nav className='navbar'>
<a href="#">About</a>
<a href="#">Contact</a>
    <Link to= "/" >Home</Link>

    <br></br>

 </nav>
  )    
}

export default Navbar
