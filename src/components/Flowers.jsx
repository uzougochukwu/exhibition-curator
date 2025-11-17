import React from 'react'

function Flowers() {
    //const defaulthome = "/defaulthome"
    const defaulthome = "/"

    // --- Standard CSS Styles used in PersonalExhibition ---
    const centeredContainerStyle = {
      maxWidth: '800px', // Limits the content width
      margin: '0 auto', // Centers the block horizontally
      padding: '16px',
      textAlign: 'center', // Centers text and inline blocks
    };
    
    // Centers the buttons/links group using Flexbox
    const headerLinksStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '24px',
      // Simple media query substitute (will apply to all, but intended for mobile stack)
      '@media (max-width: 640px)': {
          flexDirection: 'column',
          gap: '8px',
      }
    };
    
    // Styling for the individual card.
    const artworkCardStyle = {
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      margin: '24px 0',
      backgroundColor: 'white',
      textAlign: 'left', // Ensures text details are readable (left-aligned)
    };
    
    // Centers the image using Flexbox.
    const imageContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      margin: '12px 0',
    };
    
    const linkStylePrimary = {
      color: '#4f46e5', // Indigo
      textDecoration: 'underline',
      fontWeight: '500',
      display: 'block', // Makes the link take up its own line
      marginTop: '16px',
    };

    const headerTextStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#4f46e5',
        marginBottom: '16px',
    };

    const buttonStyleSecondary = {
      padding: '8px 16px',
      backgroundColor: '#e5e7eb', // Gray-200
      color: '#1f2937', // Gray-800
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
    };


    // Helper component to render the details block for reuse
    const ArtworkItem = ({ title, date, by, desc, imgSrc, imgAlt, location, city, state, websiteUrl, source }) => {
        return (
            <div style={artworkCardStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>{title}</h3>
                
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    <span style={{ fontWeight: '600' }}>Source:</span> {source}
                </p>

                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    <span style={{ fontWeight: '600' }}>Date:</span> {date}
                </p>

                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    <span style={{ fontWeight: '600' }}>By:</span> {by}
                </p>

                <p style={{ fontWeight: '600', paddingTop: '8px' }}>Description:</p>
                <p style={{ color: '#374151', fontStyle: 'italic' }}>{desc}</p>
                
                <div style={imageContainerStyle}>
                    <img
                        src={imgSrc}
                        alt={imgAlt || title}
                        style={{ width: '192px', height: '192px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                        width="200"
                        height="200"
                    />
                </div>
                
                <p style={{ fontWeight: '600', paddingTop: '8px' }}>Location:</p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Street: {location}</p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>City: {city}</p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>State: {state}</p>

                <a 
                    href={websiteUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={linkStylePrimary}
                >
                    View on {source.split(' ')[0]} Website
                </a>
            </div>
        );
    };

    return (
        <div style={centeredContainerStyle}>
            <h2 style={headerTextStyle}>Example Exhibition: Flowers</h2>
            
            <div style={headerLinksStyle}>
                <a href={defaulthome}>
                    <button style={buttonStyleSecondary}>Back to Home</button>
                </a>
            </div>
            
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563', marginTop: '32px', marginBottom: '16px' }}>Example Artworks</p>

            <ArtworkItem
                title="Cultivating Virtue: Botanical Motifs and Symbols in East Asian Art"
                date="2012-05-12"
                by="Robert D. Mowry"
                desc="Inspired by the beauty and resilience of plants and flowers, East Asian poets and artists have imbued them with auspicious meaning, literary resonance, and moral overtones. For example, because they survive the harsh winter months, the pine, bamboo, and Chinese plum (Prunus mume) symbolize strength in the face of adversity and are referred to as the “Three Friends of Winter.” Flowers affiliated with the four seasons and twelve months are also pervasive themes. This gallery rotation presents a small selection of later East Asian paintings that feature popular botanical themes and symbols, complemented by an array of ceramics with similar motifs. Organized by Robert D. Mowry, Alan J. Dworsky Curator of Chinese Art; and Melissa A. Moy, Cunningham Assistant Curator of Asian Art, both in the Division of Asian and Mediterranean Art, Harvard Art Museums."
                imgSrc="https://nrs.harvard.edu/urn-3:HUAM:51754_dynmc"
                location="32 Quincy Street"
                city="Cambridge"
                state="MA"
                websiteUrl="https://www.harvardartmuseums.org/visit/exhibitions/4531"
                source="Harvard Art Museums"
            />
            
            <ArtworkItem
                title="Flowers in a Glass"
                date="1606"
                by="Ambrosius Bosschaert (Dutch, 1573-1621)"
                desc="One of the first artists to specialize in flower painting, Ambrosius Bosschaert may have been inspired by the botanical gardens and scientific collections in his hometown of Middelburg. The flowers in this bouquet might be common today, but in the 1600s they were costly rarities. Bosschaert captured their fragile beauty with luminous colors and exquisite detail."
                imgSrc="https://openaccess-cdn.clevelandart.org/1960.108/1960.108_web.jpg"
                location="11150 East Blvd"
                city="Cleveland"
                state="OH"
                websiteUrl="https://clevelandart.org/art/1960.108"
                source="Cleveland Museum of Art"
            />
            
            <ArtworkItem
                title="Vase of Flowers"    
                date="1916"
                by="Odilon Redon (French, 1840-1916)"
                desc="Inspired by Cleveland’s groundbreaking acquisitions of Odilon Redon’s artworks during the 1920s, local philanthropist and collector Leonard C. Hanna Jr. purchased this luminous pastel of a floral still life in 1937. Hanna acquired it from Jacques Seligmann, a dealer based in New York City and Paris who was fundamental in bringing 19th-century French art to American audiences. In 1939, Hanna loaned the pastel to the New York World’s Fair, where it represented Redon’s work. Those who saw it there were attracted to the vivid color and timeless subject, which preoccupied the artist at the end of his life."
                imgSrc="https://openaccess-cdn.clevelandart.org/1958.46/1958.46_web.jpg"
                location="11150 East Blvd"
                city="Cleveland"
                state="OH"
                websiteUrl="https://clevelandart.org/art/1958.46"
                source="Cleveland Museum of Art"
            />
        </div>
    )
}

export default Flowers