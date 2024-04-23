import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const TrilaterationVisualization = () => {
  // Anchor positions and distances in meters
  const [anchorPositions] = useState([
    [0, 0],
    [0, 40.8 * 0.3048], // Convert feet to meters
    [22 * 0.3048, 40.8 * 0.3048], // Convert feet to meters
  ]);
  const [distances] = useState([1472 / 1000, 2467 / 1000, 4451 / 1000]); // Convert millimeters to meters

  // State for estimated position
  const [estimatedPosition, setEstimatedPosition] = useState([0, 0]);

  useEffect(() => {
    // Function to perform trilateration
    const trilaterate = (anchorPositions, distances) => {
      const numAnchors = anchorPositions.length;
      if (numAnchors < 3) {
        throw new Error("Trilateration requires at least three anchor nodes.");
      }

      // Initialize matrices
      const A = [];
      const b = [];
      for (let i = 0; i < numAnchors - 1; i++) {
        const x0 = anchorPositions[0][0];
        const y0 = anchorPositions[0][1];
        const x1 = anchorPositions[i + 1][0];
        const y1 = anchorPositions[i + 1][1];
        const d0 = distances[0];
        const di = distances[i + 1];
        A.push([2 * (x1 - x0), 2 * (y1 - y0)]);
        b.push([d0 ** 2 - di ** 2 - x0 ** 2 + x1 ** 2 - y0 ** 2 + y1 ** 2]);
      }

      // Solve linear least squares problem
      const A_matrix = math.matrix(A);
      const b_matrix = math.matrix(b);
      const solution = math.lusolve(A_matrix, b_matrix)._data;

      const x = solution[0][0];
      const y = solution[1][0];

      return [x, y];
    };

    // Call trilateration function
    const newEstimatedPosition = trilaterate(anchorPositions, distances);
    setEstimatedPosition(newEstimatedPosition);
  }, [anchorPositions, distances]);

  return (
    <div>
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'markers',
            x: anchorPositions.map(pos => pos[0]),
            y: anchorPositions.map(pos => pos[1]),
            marker: { color: 'red' },
            name: 'Anchor Nodes'
          },
          {
            type: 'scatter',
            mode: 'markers',
            x: [estimatedPosition[0]],
            y: [estimatedPosition[1]],
            marker: { color: 'blue', size: 10 },
            name: 'Estimated Position'
          },
          ...anchorPositions.map(pos => ({
            type: 'scatter',
            mode: 'lines',
            x: [pos[0], estimatedPosition[0]],
            y: [pos[1], estimatedPosition[1]],
            line: { dash: 'dash', color: 'black' },
            showlegend: false
          }))
        ]}
        layout={{
          width: 800,
          height: 600,
          title: 'UWB Positioning',
          xaxis: { title: 'X' },
          yaxis: { title: 'Y' },
          showlegend: true,
          grid: { rows: 1, columns: 1 },
          margin: { l: 50, r: 50, b: 50, t: 50 },
          autosize: true,
          hovermode: 'closest',
          hoverlabel: { bgcolor: '#FFF' }
        }}
      />
    </div>
  );
};

export default TrilaterationVisualization;