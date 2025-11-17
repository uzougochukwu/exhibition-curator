import React from 'react'

function MountainExamples() {
    const defaulthome = "/defaulthome"

    // --- Standard CSS Styles (Copied from PersonalExhibition) ---
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
      // Simple media query substitute
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

    // Helper component to render the details block
    const ArtworkItem = ({ title, desc, imgSrc, imgAlt, location, city, state, websiteUrl, source }) => {
        return (
            <div style={artworkCardStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>{title}</h3>
                
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    <span style={{ fontWeight: '600' }}>Source:</span> {source}
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

    // --- Main Component Render ---
    return (
        <div style={centeredContainerStyle}>
            <h2 style={headerTextStyle}>Example Exhibition: Mountains</h2>
            
            <div style={headerLinksStyle}>
                <a href={defaulthome}>
                    <button style={buttonStyleSecondary}>Back to Home</button>
                </a>
            </div>
            
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563', marginTop: '32px', marginBottom: '16px' }}>Example Artworks</p>

            <ArtworkItem
                title="Mountain View and Blue Water"
                desc="Tanomura Chikuden was an eminent painter whose adopted son, Tanomura Chokunyū (1814–1907), was Seifū Yohei III’s painting teacher. This work was displayed at a gathering commemorating the 10th anniversary of Chokunyū’s death, something we know only because its custom-made box and archival documents have been carefully kept together. The box inscription also confirms that Chikuden was emulating the style of the Mi family of painters, active during China’s Southern Song dynasty (1127–1279). The painting’s Chinese-style silk wrapper is inscribed and sealed on its interior by members of Chokunyū’s community."
                imgSrc="https://openaccess-cdn.clevelandart.org/1985.250/1985.250_web.jpg"
                location="11150 East Blvd"
                city="Cleveland"
                state="OH"
                websiteUrl="https://clevelandart.org/art/1985.250"
                source="Cleveland Museum of Art"
            />
            
            <ArtworkItem
                title="Streams and Mountains without End: Landscape Paintings from China, Korea, and Japan"
                desc="Drawing upon the Sackler Museum’s permanent collection, as well as on one of the most distinguished private collections of Chinese painting in the country, this exhibition displays an impressive array of East Asian landscape paintings. Landscapes emerged as the principal subject of Chinese painting by the Song dynasty (960–1279) and have remained preeminent among the arts of East Asia for over 1000 years. The Chinese-style depiction of landscapes spread in the 14th and 15th centuries, soaring to popularity in Korea during the Chosŏn dynasty (1392–1910) and in Japan during the Muromachi period (1392–1573). Landscapes—whether real or imagined—reflected the philosophical search for the principles that underlie the unity and harmony of nature, a search intricately linked to Daoism."
                imgSrc="https://ids.lib.harvard.edu/ids/view/14178745"
                location="32 Quincy Street"
                city="Cambridge"
                state="MA"
                websiteUrl="https://www.harvardartmuseums.org/visit/exhibitions/3243"
                source="Harvard Art Museums"
            />

            <ArtworkItem
                title="Miniature Mountain with Daoist Paradise"
                desc="Sizable jade boulders of mountainous landscapes were carved to represent the search for the paradise or immortals' dwellings in the mountains. This Daoist theme has fired the Chinese imagination throughout history. Believed to have spiritual and magical properties, jade has long been used in tombs and intended for preserving the corporeal body and the soul in the quest for eternity. It is recorded that Daoist practitioners drank morning dews with scraps of jade as an elixir of immortality."
                imgSrc="https://openaccess-cdn.clevelandart.org/1941.594/1941.594_web.jpg"
                location="11150 East Blvd"
                city="Cleveland"
                state="OH"
                websiteUrl="https://clevelandart.org/art/1941.594"
                source="Cleveland Museum of Art"
            />
        </div>
    )
}

export default MountainExamples