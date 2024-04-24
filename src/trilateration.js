// import React, { useState, useEffect } from 'react';
// import Plot from 'react-plotly.js';
// import * as math from 'mathjs';
// import backgroundImage from './map.jpg'; // Import the image
// const Trilateration = () => {
//   const [estimatedPosition, setEstimatedPosition] = useState(null);

//   const trilaterate = (anchorPositions, distances) => {
//     const numAnchors = anchorPositions.length;
//     if (numAnchors < 3) {
//       throw new Error("Trilateration requires at least three anchor nodes.");
//     }

//     // Initialize matrices
//     let A = Array(numAnchors - 1).fill(0).map(() => Array(2).fill(0));
//     let b = Array(numAnchors - 1).fill(0).map(() => Array(1).fill(0));

//     // Build matrices
//     for (let i = 0; i < numAnchors - 1; i++) {
//       A[i][0] = 2 * (anchorPositions[i + 1][0] - anchorPositions[0][0]);
//       A[i][1] = 2 * (anchorPositions[i + 1][1] - anchorPositions[0][1]);
//       b[i][0] = distances[0]**2 - distances[i + 1]**2 - anchorPositions[0][0]**2 + anchorPositions[i + 1][0]**2 - anchorPositions[0][1]**2 + anchorPositions[i + 1][1]**2;
//     }

//     // Solve linear least squares problem using mathjs
//     try {
//       const solution = math.lusolve(A, b);
//       setEstimatedPosition([solution[0][0], solution[1][0]]);
//     } catch (error) {
//       console.error("Trilateration failed. Anchors may be collinear.");
//     }
//   };

//   // Example anchor positions and distances
//   const anchorPositions = [[0, 0], [0, 40.8 * 0.3048], [22 * 0.3048, 40.8 * 0.3048]];
//   const distancesMeters = [1472, 2467, 4451].map(distance => distance / 1000);

//   // Call trilateration function
//   useEffect(() => {
//     trilaterate(anchorPositions, distancesMeters);
//   }, []);

//   // Plotting
//   const plotData = [
//     {
//       type: 'scatter',
//       mode: 'markers',
//       x: anchorPositions.map(pos => pos[0]),
//       y: anchorPositions.map(pos => pos[1]),
//       marker: { color: 'red' },
//       name: 'Anchors'
//     },
//     estimatedPosition && {
//       type: 'scatter',
//       mode: 'markers',
//       x: [estimatedPosition[0]],
//       y: [estimatedPosition[1]],
//       marker: { color: 'blue' },
//       name: 'Estimated Position'
//     }
//   ].filter(Boolean);


//   return (
//     <div style={{ position: 'relative', width: '200rem', height: '40rem' }}>
//      {/* Plot Container */}
//       <div style={{ position: 'absolute', top: 0, left: 0, width: '90rem', height: '40rem', zIndex: 2 }}>
//         <Plot
//           data={plotData}
//           layout={{
//             title: 'UWB',
//             xaxis: { range: [0, 22 * 0.3048], visible: true },
//             yaxis: { range: [0, 40.8 * 0.3048], visible: true },
//             paper_bgcolor: 'transparent',
//             plot_bgcolor: 'transparent'
//           }}
//           style={{ width: '100%', height: '100%' }}
//         />
//       </div>
//     </div>
//   );

// };

// export default Trilateration;
