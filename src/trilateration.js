// import React, { useState, useEffect } from 'react';
// import backgroundImage from './map.jpg';

// const Trilateration = () => {
//   const [estimatedPosition, setEstimatedPosition] = useState(null);

//   useEffect(() => {
//     // Fetch distances initially
//     fetchDistances(["10010A", "1000EE", "10010C"]);

//     // Set up interval to fetch data every 5 seconds
//     const intervalId = setInterval(() => fetchDistances(["10010A", "1000EE", "10010C"]), 10000);

//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchDistances = async (transmitterSerialNumbers) => {
//     try {
//       const response = await fetch('https://glorious-gray-indri.cyclic.app/distance', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ transmitterSerialNumbers })
//       });
//       const distanceData = await response.json();
//       console.log('Distances:', distanceData); // Log the fetched distances
  
//       // Transform the distance data to the required format
//       const distances = distanceData.map(item => ({
//         transmitterSerialNumber: item.transmitterSerialNumber,
//         distance: item.distance / 1000 // Divide each distance by 1000
//       }));
  
//       // Call trilateration function with transformed distances
//       trilaterate(distances);
//     } catch (error) {
//       console.error('Error fetching distances:', error);
//     }
//   };
  
  
//   const trilaterate = async (distances) => {
//     try {
//       const anchorPositions = [
//         [0, 0],
//         [0, 12.42912],
//         [6.70656, 12.42912]
//       ];
  
//       // Construct the data object with anchorPositions and distances
//       const data = {
//         anchorPositions,
//         distances: distances.map(item => item.distance)
//       };
  
//       const response = await fetch('https://glorious-gray-indri.cyclic.app/trilaterate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
  
//       const estimatedPosition = await response.json();
//       console.log('Estimated position:', estimatedPosition); // Log the estimated position7
//     //   setEstimatedPosition(estimatedPosition);
//     setEstimatedPosition(estimatedPosition.estimatedPosition);
//     } catch (error) {
//       console.error('Error performing trilateration:', error);
//     }
//   };
  
  
// //   // Plotting
// // // Plotting
// // const plotData = [
// //     {
// //       type: 'scatter',
// //       mode: 'markers',
// //       x: [0, 0, 6.70656],
// //       y: [0, 12.42912, 12.42912],
// //       marker: { color: 'red' },
// //       name: 'Anchors'
// //     },
// //     estimatedPosition && {
// //       type: 'scatter',
// //       mode: 'markers',
// //       x: [estimatedPosition[0]],
// //       y: [estimatedPosition[1]],
// //       marker: { color: 'blue' },
// //       name: 'Estimated Position'
// //     }
// //   ].filter(Boolean);
// //   return (
// //     <Plot
// //       data={plotData}
// //       layout={{
// //         xaxis: { range: [0, 6.70656], visible: false },
// //         yaxis: { range: [0, 12.42912], visible: false },
// //         paper_bgcolor: 'transparent',
// //         plot_bgcolor: 'transparent',
// //         images: [{
// //           source: backgroundImage, // URL of the background image
// //           xref: 'paper',
// //           yref: 'paper',
// //           x: 0, // X position of the image (0 is left)
// //           y: 1, // Y position of the image (1 is top)
// //           sizex: 1, // Width of the image (1 is full width)
// //           sizey: 1, // Height of the image (1 is full height)
// //           layer: 'below', // Show the image below other plot elements
// //           opacity: 1 // Opacity of the image
// //         }],
// //         // Configuration to disable zooming, panning, and other features
// //         config: {
// //           scrollZoom: false,
// //           displayModeBar: false,
// //           displaylogo: false,
// //           responsive: true,
// //           editable: false
// //           // Add other configuration options as needed
// //         }
// //       }}
// //       style={{ width: '800px', height: '400px' }}
// //     />
// //   );
  
// // };

// // export default Trilateration;

// // Define the grid style based on your background image dimensions