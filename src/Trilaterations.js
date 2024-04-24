import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
const Trilateration = () => {
  const [estimatedPosition, setEstimatedPosition] = useState(null);
  const [distances, setDistances] = useState([]);

  useEffect(() => {
    // Fetch distances initially
    fetchDistances(["10010A", "1000EE", "10010C"]);

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(() => fetchDistances(["10010A", "1000EE", "10010C"]), 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchDistances = async (transmitterSerialNumbers) => {
    try {
      const response = await fetch('http://103.9.23.119:6611/distance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transmitterSerialNumbers })
      });
      const data = await response.json();
      setDistances(data);

      // Call trilateration function with fetched distances
      trilaterate(data);
    } catch (error) {
      console.error('Error fetching distances:', error);
    }
  };

  const trilaterate = async (distances) => {
    try {
      const anchorPositions = [
        [0, 0],
        [0, 12.42912],
        [6.70656, 12.42912]
      ];

      const response = await fetch('http://103.9.23.119:6611/trilateration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anchorPositions, distances }),
      });

      const estimatedPosition = await response.json();
      setEstimatedPosition(estimatedPosition);
    } catch (error) {
      console.error('Error performing trilateration:', error);
    }
  };

  // Plotting
  const plotData = [
    {
      type: 'scatter',
      mode: 'markers',
      x: [0, 0, 6.70656],
      y: [0, 12.42912, 12.42912],
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
    <div style={{ position: 'relative', width: '800px', height: '400px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
        <Plot
          data={plotData}
          layout={{
            title: 'Trilateration',
            xaxis: { range: [0, 10], visible: true },
            yaxis: { range: [0, 20], visible: true },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent'
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Trilateration;
