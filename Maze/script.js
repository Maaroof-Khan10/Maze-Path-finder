let cols, rows;
let w = 25;
let grid = [];
let stack = [];
let q = [];
let current;
let back;
let s, start, g, goal;
let run = false;
let algo = 0;
let reset = false;

function setup() {
  createCanvas(1000, 500);
  console.log(width, height);
  
  cols = floor(width / w);
  rows = floor(height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  s = floor(random(0, grid.length))
  g = floor(random(0, grid.length))
  while (s === g) {
    g = floor(random(0, grid.length))
  }
  start = grid[s];
  goal = grid[g];
  current = start;

  current.mapped = true;

    let next = current.checkNeighbors();
    if (next) {
      next.mapped = true;

      stack.push(current);

      removeWalls(current, next);

      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

  while (current != start) {
    current.mapped = true;

    let next = current.checkNeighbors();
    if (next) {
      next.mapped = true;

      stack.push(current);

      removeWalls(current, next);

      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }

  stack = []
  current = start;
  start.visited = true;
}

function draw() {
  background(51);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  switch (algo) {
    case 0:
      document.getElementById("algText").innerHTML = "A*";
      break;
    case 1:
      document.getElementById("algText").innerHTML = "Djikstra's";
      break;
    case 2:
      document.getElementById("algText").innerHTML = "Depth First";
      break;
    case 3:
      document.getElementById("algText").innerHTML = "Breadth First";
      break;
    default:
      break;
  }

  if (run) {
    if (current != goal) {
      if (algo == 0) aStar();
      if (algo == 1) djikstra();
      if (algo == 2) depthFirst();
      if (algo == 3) breadthFirst();
    } else if (back != start) {
      back.path = true;
      back = back.parent;
    }
  }
}

function keyPressed() {
  if (key == 'r') run = true;
  document.getElementById("algText").innerHTML;
  if (key == 'a') algo = 0;
  if (key == 's') algo = 1;
  if (key == 'd') algo = 2;
  if (key == 'f') algo = 3;
  if (key == 'z') {
    run = false;
    current = start;
    stack = []
    q = []
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        grid[index(i, j)].visited = false;
        grid[index(i, j)].path = false;
        grid[index(i, j)].distance = 0;
        grid[index(i, j)].a = 0;
        grid[index(i, j)].parent = undefined;
      }
    }
  }
  if (key == 'n') {
    run = false;
    stack = []
    q = []
    grid = []
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let cell = new Cell(i, j);
        grid.push(cell);
      }
    }
  
    s = floor(random(0, grid.length))
    g = floor(random(0, grid.length))
    while (s === g) {
      g = floor(random(0, grid.length))
    }
    start = grid[s];
    goal = grid[g];
    current = start;

  current.mapped = true;

    let next = current.checkNeighbors();
    if (next) {
      next.mapped = true;

      stack.push(current);

      removeWalls(current, next);

      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

  while (current != start) {
    current.mapped = true;

    let next = current.checkNeighbors();
    if (next) {
      next.mapped = true;

      stack.push(current);

      removeWalls(current, next);

      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }

  stack = []
  current = start;
  start.visited = true;
  }
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.mapped = false;
    this.visited = false;
    this.path = false;
    this.parent;
    this.distance = 0;
    this.a = 0;
  }

  checkNeighbors() {
    let neighbors = [];

    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top && !top.mapped) {
      neighbors.push(top);
    }
    if (right && !right.mapped) {
      neighbors.push(right);
    }
    if (bottom && !bottom.mapped) {
      neighbors.push(bottom);
    }
    if (left && !left.mapped) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    fill(242, 236, 255, 255)
    if (this.walls[0]) line(x, y, x + w, y);
    if (this.walls[1]) line(x + w, y, x + w, y + w);
    if (this.walls[2]) line(x + w, y + w, x, y + w);
    if (this.walls[3]) line(x, y + w, x, y);

    if (this.mapped) {
      noStroke();
      fill(0, 0, 0, 100);
      rect(x, y, w, w);
    }

    if (this.visited) {
      noStroke();
      fill(255, 0, 255, 80);
      rect(x, y, w, w);
    }

    if (this.visited && this.path) {
      noStroke();
      fill(134, 133, 239, 150);
      rect(x, y, w, w);
    }

    if (this === start) {
      fill(0, 200, 150, 200);
      rect(x, y, w, w);
    } else if (this === goal) {
      fill(255, 0, 30, 200);
      rect(x, y, w, w);
    }
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function depthFirst() {
  current.visited = true;
  if (!current.walls[0]) {
    let top = grid[index(current.i, current.j - 1)];
    if (top && !top.visited) {
      stack.push(top)
      top.parent = current;
    }
  } 
  if (!current.walls[1]) {
    let right = grid[index(current.i + 1, current.j)];
    if (right && !right.visited) {
      stack.push(right);
      right.parent = current;
    }
  } 
  if (!current.walls[2]) {
    let bottom = grid[index(current.i, current.j + 1)];
    if (bottom && !bottom.visited) {
      stack.push(bottom);
      bottom.parent = current;
    }
  } 
  if (!current.walls[3]) {
    let left = grid[index(current.i - 1, current.j)];
    if (left && !left.visited) {
      stack.push(left);
      left.parent = current;
    }
  }

  current = stack.pop();
  back = current;
}

function breadthFirst() {
  current.visited = true;
  if (!current.walls[0]) {
    let top = grid[index(current.i, current.j - 1)];
    if (top && !top.visited) {
      q.push(top)
      top.parent = current;
    }
  } 
  if (!current.walls[1]) {
    let right = grid[index(current.i + 1, current.j)];
    if (right && !right.visited) {
      q.push(right);
      right.parent = current;
    }
  } 
  if (!current.walls[2]) {
    let bottom = grid[index(current.i, current.j + 1)];
    if (bottom && !bottom.visited) {
      q.push(bottom);
      bottom.parent = current;
    }
  } 
  if (!current.walls[3]) {
    let left = grid[index(current.i - 1, current.j)];
    if (left && !left.visited) {
      q.push(left);
      left.parent = current;
    }
  }

  current = q.shift();
  back = current;
}

function getMin() {
  let min = Infinity;
  let n;
  for (let i = 0; i < q.length; i++) {
    if (q[i].distance < min) {
      min = q[i].distance
      n = i;
    }
  }
  return q.splice(n, 1)[0];
}

function djikstra() {
  current.visited = true;
  if (!current.walls[0]) {
    let top = grid[index(current.i, current.j - 1)];
    if (top && !top.visited) {
      q.push(top)
      top.parent = current;
      top.distance = current.distance + 1;
    }
  } 
  if (!current.walls[1]) {
    let right = grid[index(current.i + 1, current.j)];
    if (right && !right.visited) {
      q.push(right);
      right.parent = current;
      right.distance = current.distance + 1;
    }
  } 
  if (!current.walls[2]) {
    let bottom = grid[index(current.i, current.j + 1)];
    if (bottom && !bottom.visited) {
      q.push(bottom);
      bottom.parent = current;
      bottom.distance = bottom.distance + 1;
    }
  } 
  if (!current.walls[3]) {
    let left = grid[index(current.i - 1, current.j)];
    if (left && !left.visited) {
      q.push(left);
      left.parent = current;
      left.distance = current.distance + 1;
    }
  }

  current = getMin();
  back = current;
}

function getMinA() {
  let min = Infinity;
  let n;
  for (let i = 0; i < q.length; i++) {
    if (q[i].a < min) {
      min = q[i].a;
      n = i;
    }
  }
  return q.splice(n, 1)[0];
}

function aStar() {
  current.visited = true;
  if (!current.walls[0]) {
    let top = grid[index(current.i, current.j - 1)];
    if (top && !top.visited) {
      q.push(top)
      top.parent = current;
      top.distance = current.distance + 1;
      top.a = top.distance + Math.sqrt(Math.pow((top.i - goal.i), 2) + Math.pow((top.j - goal.j), 2));
    }
  } 
  if (!current.walls[1]) {
    let right = grid[index(current.i + 1, current.j)];
    if (right && !right.visited) {
      q.push(right);
      right.parent = current;
      right.distance = current.distance + 1;
      right.a = right.distance + Math.sqrt(Math.pow((right.i - goal.i), 2) + Math.pow((right.j - goal.j), 2));
    }
  } 
  if (!current.walls[2]) {
    let bottom = grid[index(current.i, current.j + 1)];
    if (bottom && !bottom.visited) {
      q.push(bottom);
      bottom.parent = current;
      bottom.distance = bottom.distance + 1;
      bottom.a = bottom.distance + Math.sqrt(Math.pow((bottom.i - goal.i), 2) + Math.pow((bottom.j - goal.j), 2));
    }
  } 
  if (!current.walls[3]) {
    let left = grid[index(current.i - 1, current.j)];
    if (left && !left.visited) {
      q.push(left);
      left.parent = current;
      left.a = left.distance + Math.sqrt(Math.pow((left.i - goal.i), 2) + Math.pow((left.j - goal.j), 2));
    }
  }

  current = getMinA();
  back = current;
}