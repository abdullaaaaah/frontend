import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { matrix, multiply, transpose } from 'mathjs';

const Trilateration = () => {
  const [estimatedPosition, setEstimatedPosition] = useState(null);

  const trilaterate = (anchorPositions, distances) => {
    const numAnchors = anchorPositions.length;
    if (numAnchors < 3) {
      throw new Error("Trilateration requires at least three anchor nodes.");
    }

    // Initialize matrices
    let A = Array(numAnchors - 1).fill(0).map(() => Array(2).fill(0));
    let b = Array(numAnchors - 1).fill(0).map(() => Array(1).fill(0));

    // Build matrices
    for (let i = 0; i < numAnchors - 1; i++) {
      A[i][0] = 2 * (anchorPositions[i + 1][0] - anchorPositions[0][0]);
      A[i][1] = 2 * (anchorPositions[i + 1][1] - anchorPositions[0][1]);
      b[i] = [distances[0]**2 - distances[i + 1]**2 - anchorPositions[0][0]**2 + anchorPositions[i + 1][0]**2 - anchorPositions[0][1]**2 + anchorPositions[i + 1][1]**2];
    }

    // Solve linear least squares problem
    try {
      const A_Matrix = matrix(A);
      const b_Matrix = matrix(b);

      const solutionMatrix = multiply(
        multiply(
          multiply(
            transpose(A_Matrix),
            A_Matrix
          ).inv(),
          transpose(A_Matrix)
        ),
        b_Matrix
      );

      const x = solutionMatrix.get([0, 0]);
      const y = solutionMatrix.get([1, 0]);
      setEstimatedPosition([x, y]);
      
    } catch (error) {
      console.error("Trilateration failed. Anchors may be collinear.");
    }
  };

  const anchorPositions = [[0, 0], [22 * 0.3048, 40.8 * 0.3048],[0, 40.8 * 0.3048],];
  const distancesMeters = [1472, 4451, 2467].map(distance => distance / 1000);

  useEffect(() => {
    trilaterate(anchorPositions, distancesMeters);
  }, []);

  const plotData = [
    {
      type: 'scatter',
      mode: 'markers',
      x: anchorPositions.map(pos => pos[0]),
      y: anchorPositions.map(pos => pos[1]),
      marker: { color: 'red' },
      name: 'Anchors'
    },
    estimatedPosition && {
      type: 'scatter',
      mode: 'markers',
      x: [estimatedPosition[0]],
      y: [estimatedPosition[1]],
      marker: { color: 'blue' },
      name: 'Estimated Position'
    }
  ].filter(Boolean);

  return (
    <div>
      {estimatedPosition && (
        <Plot
          data={plotData}
          layout={{
            title: 'UWB Positioning',
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            showlegend: true
          }}
        />
      )}
    </div>
  );
};
export default Trilateration;