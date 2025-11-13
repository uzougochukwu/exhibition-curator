import React from 'react'

function Flowers() {
    const defaulthome = "/defaulthome"
  return (
    // --- MODIFICATION: Added inline style for centering ---
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centers children horizontally
        width: '100%',
        padding: '20px'
      }}
    >
        <p><a href={defaulthome}>Back to Home</a></p>
        <p>Title: Cultivating Virtue: Botanical Motifs and Symbols in East Asian Art</p>
        <p>Desc: Inspired by the beauty and resilience of plants and flowers, East Asian poets and artists have imbued them with auspicious meaning, literary resonance, and moral overtones. For example, because they survive the harsh winter months, the pine, bamboo, and Chinese plum (Prunus mume) symbolize strength in the face of adversity and are referred to as the “Three Friends of Winter.” Flowers affiliated with the four seasons and twelve months are also pervasive themes. This gallery rotation presents a small selection of later East Asian paintings that feature popular botanical themes and symbols, complemented by an array of ceramics with similar motifs. Organized by Robert D. Mowry, Alan J. Dworsky Curator of Chinese Art; and Melissa A. Moy, Cunningham Assistant Curator of Asian Art, both in the Division of Asian and Mediterranean Art, Harvard Art Museums. </p>
        <img
        src="https://nrs.harvard.edu/urn-3:HUAM:51754_dynmc"
        width="200"
        height="200"></img>
        <p>Location:</p>
        <p>Street: 32 Quincy Street</p>
        <p>City: Cambridge</p>
        <p>State: MA</p>
        <p><a href="https://www.harvardartmuseums.org/visit/exhibitions/4531">Harvard Website</a></p>

        {/* Horizontal Rule added for better visual separation */}
        <hr style={{ width: '50%', margin: '20px 0' }} />
        
        <p>Title: Flowers in a Glass</p>
        <p>Desc: One of the first artists to specialize in flower painting, Ambrosius Bosschaert may have been inspired by the botanical gardens and scientific collections in his hometown of Middelburg. The flowers in this bouquet might be common today, but in the 1600s they were costly rarities. Bosschaert captured their fragile beauty with luminous colors and exquisite detail.</p>
        <img
        src="https://openaccess-cdn.clevelandart.org/1960.108/1960.108_web.jpg"
        width="200"
        height="200"></img>
        <p>Location:</p>
        <p>Street: 11150 East Blvd</p>
        <p>City: Cleveland</p>
        <p>State: OH</p>    
        <p><a href="https://clevelandart.org/art/1960.108">Cleveland Website</a></p>

        {/* Horizontal Rule added for better visual separation */}
        <hr style={{ width: '50%', margin: '20px 0' }} />

        <p>Title: Vase of Flowers</p>    
        <p>Desc: Inspired by Cleveland’s groundbreaking acquisitions of Odilon Redon’s artworks during the 1920s, local philanthropist and collector Leonard C. Hanna Jr. purchased this luminous pastel of a floral still life in 1937. Hanna acquired it from Jacques Seligmann, a dealer based in New York City and Paris who was fundamental in bringing 19th-century French art to American audiences. In 1939, Hanna loaned the pastel to the New York World’s Fair, where it represented Redon’s work. Those who saw it there were attracted to the vivid color and timeless subject, which preoccupied the artist at the end of his life.</p>
        <img
        src="https://openaccess-cdn.clevelandart.org/1958.46/1958.46_web.jpg"
        width="200"
        height="200"></img>
        <p>Location:</p>
        <p>Street: 11150 East Blvd</p>
        <p>City: Cleveland</p>
        <p>State: OH</p>  
        <p><a href="https://clevelandart.org/art/1958.46">Cleveland Website</a></p>
    </div>
  )
}

export default Flowers