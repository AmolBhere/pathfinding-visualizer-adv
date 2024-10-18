import React, { useState } from 'react';
import Grid from './Grid';
import { dijkstra, bfs, dfs } from './algorithms';

const App = () => {
  const [algorithm, setAlgorithm] = useState('');
  const [clearWallsTrigger, setClearWallsTrigger] = useState(false);
  const [clearGridTrigger, setClearGridTrigger] = useState(false);

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo);
  };

  const clearWalls = () => {
    setClearWallsTrigger(!clearWallsTrigger);
  };

  const clearGrid = () => {
    setClearGridTrigger(!clearGridTrigger);
  };

  return (
    <div className="app">
      <div className="buttons">
        <button onClick={() => handleAlgorithmChange('dijkstra')}>Dijkstra</button>
        <button onClick={() => handleAlgorithmChange('bfs')}>BFS</button>
        <button onClick={() => handleAlgorithmChange('dfs')}>DFS</button>
        <button onClick={clearWalls}>Clear Walls</button>
        <button onClick={clearGrid}>Clear Grid</button>
      </div>
      <Grid 
        algorithm={algorithm} 
        clearWallsTrigger={clearWallsTrigger}
        clearGridTrigger={clearGridTrigger}
      />
    </div>
  );
};

export default App;
