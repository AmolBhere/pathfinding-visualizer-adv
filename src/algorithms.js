export const dijkstra = (grid, startNode, endNode) => {
  const visitedNodes = [];

  // Set all nodes' distances to Infinity except the start node
  for (const row of grid) {
    for (const node of row) {
      node.distance = node === startNode ? 0 : Infinity;
      node.previousNode = null;
    }
  }

  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    // Sort nodes by distance before selecting the closest one
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If it's a wall, skip it
    if (closestNode.isWall) continue;

    // If the closest node's distance is Infinity, no further path can be found
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodes.push(closestNode);

    // If we have reached the end node, return the result
    if (closestNode === endNode) {
      return {
        visitedNodes,
        path: getNodesInShortestPathOrder(endNode),
      };
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  // Return visited nodes and an empty path if no path is found
  return { visitedNodes, path: [] };
};


export const bfs = (grid, startNode, endNode) => {
  const visitedNodes = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodes.push(currentNode);

    // If it's the end node, return the result
    if (currentNode === endNode) {
      return {
        visitedNodes,
        path: getNodesInShortestPathOrder(endNode),
      };
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return { visitedNodes, path: [] };
};

export const dfs = (grid, startNode, endNode) => {
  const visitedNodes = [];
  const stack = [startNode];
  startNode.isVisited = true;

  while (stack.length > 0) {
    const currentNode = stack.pop();
    visitedNodes.push(currentNode);

    // If it's the end node, return the result
    if (currentNode === endNode) {
      return {
        visitedNodes,
        path: getNodesInShortestPathOrder(endNode),
      };
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodes, path: [] };
};


// Helper function: Sort nodes by distance
const sortNodesByDistance = (nodes) => {
  nodes.sort((a, b) => a.distance - b.distance);
};

// Helper function: Update neighboring nodes
const updateUnvisitedNeighbors = (node, grid) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

// Helper function: Get unvisited neighbors
const getUnvisitedNeighbors = (node, grid) => {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

// Helper function: Get all nodes in the grid
const getAllNodes = (grid) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

// Helper function: Get nodes in the shortest path order
const getNodesInShortestPathOrder = (endNode) => {
  const nodesInPath = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    nodesInPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInPath;
};
