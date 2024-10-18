import React, { useState, useEffect } from "react";
import Node from "./Node";
import { dijkstra, bfs, dfs } from "./algorithms";

const Grid = ({ algorithm, clearWallsTrigger, clearGridTrigger }) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null); // Track which node is being dragged
  const [startNode, setStartNode] = useState({ row: 10, col: 10 });
  const [endNode, setEndNode] = useState({ row: 10, col: 40 });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (clearWallsTrigger) {
      clearWalls();
    }
  }, [clearWallsTrigger]);

  useEffect(() => {
    if (clearGridTrigger) {
      initializeGrid();
    }
  }, [clearGridTrigger]);

  useEffect(() => {
    if (algorithm && !isRunning) {
      runAlgorithm();
    }
  }, [algorithm]);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: 25 }, (_, row) =>
      Array.from({ length: 50 }, (_, col) => ({
        row,
        col,
        isStart: row === startNode.row && col === startNode.col,
        isEnd: row === endNode.row && col === endNode.col,
        isWall: false,
        isVisited: false,
        isPath: false,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
    setIsRunning(false);
    clearAnimations();
  };

  const clearAnimations = () => {
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 50; col++) {
        if ((row === startNode.row && col === startNode.col) || (row === endNode.row && col === endNode.col)) continue;
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          element.className = "node";
        }
      }
    }
  };

  const clearWalls = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
        isVisited: false,
        isPath: false,
      }))
    );
    setGrid(newGrid);
    setIsRunning(false);
  };

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    const node = grid[row][col];

    if (node.isStart) {
      setDraggingNode("start");
    } else if (node.isEnd) {
      setDraggingNode("end");
    } else {
      const newGrid = grid.slice();
      newGrid[row][col] = { ...node, isWall: !node.isWall };
      setGrid(newGrid);
    }

    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning) return;
    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (draggingNode === "start") {
      setStartNode({ row, col });
      initializeGrid();
    } else if (draggingNode === "end") {
      setEndNode({ row, col });
      initializeGrid();
    } else if (!node.isStart && !node.isEnd) {
      newGrid[row][col] = { ...node, isWall: true };
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDraggingNode(null);
  };

  const runAlgorithm = () => {
    setIsRunning(true);
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];
    let result = [];
    switch (algorithm) {
      case "dijkstra":
        result = dijkstra(grid, start, end);
        break;
      case "bfs":
        result = bfs(grid, start, end);
        break;
      case "dfs":
        result = dfs(grid, start, end);
        break;
      default:
        break;
    }

    if (result) {
      animateAlgorithm(result.visitedNodes);
      setTimeout(() => {
        animateShortestPath(result.path);
      }, 10 * result.visitedNodes.length);
    } else {
      setIsRunning(false);
    }
  };

  const animateAlgorithm = (visitedNodes) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setIsRunning(false);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (pathNodes) => {
    pathNodes.forEach((node, index) => {
      setTimeout(() => {
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * index);
    });
  };

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, nodeIdx) => (
            <Node
              key={nodeIdx}
              node={node}
              onMouseDown={(row, col) => handleMouseDown(row, col)}
              onMouseEnter={(row, col) => handleMouseEnter(row, col)}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
