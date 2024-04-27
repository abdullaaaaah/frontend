import React, { useState, useEffect } from 'react';
import backgroundImage from './map.jpg';

const Trilateration = () => {
  const [estimatedPosition, setEstimatedPosition] = useState(null);
  const anchorPositions = [
    [0, 0],
    [6.70656, 0],
    [6.70656, 12.42912],
  ];
  useEffect(() => {
    // Fetch distances initially
    fetchDistances(["10010A", "1000EE", "10010C"]);

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(() => fetchDistances(["10010A", "1000EE", "10010C"]), 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchDistances = async (transmitterSerialNumbers) => {
    try {
      const response = await fetch('https://uwb-backend.onrender.com/distance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transmitterSerialNumbers })
      });
      const distanceData = await response.json();
      console.log('Distances:', distanceData); // Log the fetched distances
  
      // Transform the distance data to the required format
      const distances = distanceData.map(item => ({
        transmitterSerialNumber: item.transmitterSerialNumber,
        distance: item.distance / 1000 // Divide each distance by 1000
      }));
  
      // Call trilateration function with transformed distances
      trilaterate(distances);
    } catch (error) {
      console.error('Error fetching distances:', error);
    }
  };

  const trilaterate = async (distances) => {
    try {
      const anchorPositions = [
    [0, 0],
    [6.70656, 0],
    [6.70656, 12.42912],
  ];
  
      // Construct the data object with anchorPositions and distances
      const data = {
        anchorPositions,
        distances: distances.map(item => item.distance)
      };
  
      const response = await fetch('https://uwb-backend.onrender.com/trilaterate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const estimatedPosition = await response.json();
      console.log('Estimated position:', estimatedPosition); // Log the estimated position7
      //   setEstimatedPosition(estimatedPosition);
      setEstimatedPosition(estimatedPosition.estimatedPosition);
    } catch (error) {
      console.error('Error performing trilateration:', error);
    }
  };

  // Define the grid style based on your background image dimensions
  const gridStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '450px', // Width and height swapped for rotated image
    width: '825px', // Width and height swapped for rotated image
    marginLeft: '250px', // Use marginLeft with a capital 'L'
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center', // Center the image horizontally
    alignItems: 'center', // Center the image vertically
    // transform: 'rotate(90deg)', // Rotate the grid 90 degrees clockwise
  };

  const markerWrapperStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    // transform: 'rotate(-90deg)', // Counter-rotate the marker wrapper to align with the grid rotation
  };
  const markerStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'red',
    left: estimatedPosition ? `${estimatedPosition[0] * 100 / 6.70656}%` : 0,
    top: estimatedPosition ? `${100 - estimatedPosition[1] * 100 / 12.42912}%` : 0,
    textAlign: 'center', // Center the text horizontally
    lineHeight: '10px', // Center the text vertically
    color: 'white', // Text color
  };
  
  const anchorMarkerStyle = ([x, y]) => ({
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'blue',
    left: `${y * 100 / 12.42912}%`, // Adjusted x and y coordinates
    top: `${x * 100 / 6.70656}%`, // Adjusted x and y coordinates
    textAlign: 'center', // Center the text horizontally
    lineHeight: '10px', // Center the text vertically
    color: 'white', // Text color
  });
  
  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '5px',
    display: 'none',
    zIndex: 1,
  };

  const handleMouseOver = (e) => {
    if (estimatedPosition) {
      const tooltip = e.currentTarget.nextSibling;
      tooltip.style.display = 'block';
      tooltip.textContent = `X: ${estimatedPosition[0].toFixed(2)}, Y: ${estimatedPosition[1].toFixed(2)}`;
    }
  };

  const handleMouseOut = (e) => {
    const tooltip = e.currentTarget.nextSibling;
    tooltip.style.display = 'none';
  };

  return (
    <div style={gridStyle}>
      <div style={markerWrapperStyle}>
        {estimatedPosition && (
          <>
            <div style={markerStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}></div>
            <div style={tooltipStyle} className="tooltip"></div>
          </>
        )}
        {anchorPositions.map(([x, y], index) => (
          <div
            key={index}
            style={anchorMarkerStyle([x, y])}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Trilateration;
