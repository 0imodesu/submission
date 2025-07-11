const mazeElement = document.getElementById("maze");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const respawnBtn = document.getElementById("respawn");

const ROWS = 15, COLS = 15;
let maze = [], start, goal, player;
let startTime, moves = 0, timerInterval;

// ランダム迷路生成（DFSベース）
function genMaze(r, c) {
  const maze = Array(r).fill().map(() => Array(c).fill(1));
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  function dfs(y,x) {
    maze[y][x] = 0;
    dirs.sort(() => Math.random()-0.5).forEach(([dy,dx]) => {
      const ny = y + dy*2, nx = x + dx*2;
      if (ny>=0 && ny<r && nx>=0 && nx<c && maze[ny][nx]===1) {
        maze[y+dy][x+dx] = 0;
        dfs(ny,nx);
      }
    });
  }
  dfs(0,0);
  return maze;
}

function drawMaze() {
  mazeElement.style.gridTemplateColumns = `repeat(${COLS},30px)`;
  mazeElement.style.gridTemplateRows = `repeat(${ROWS},30px)`;
  mazeElement.innerHTML = "";
  for (let y=0; y<ROWS; y++){
    for (let x=0; x<COLS; x++){
      const cell = document.createElement("div");
      cell.className = "cell " + (maze[y][x] ? "wall" : "path");
      if (y===start[0]&&x===start[1]) cell.classList.add("start");
      if (y===goal[0]&&x===goal[1]) cell.classList.add("goal");
      if (y===player[0]&&x===player[1]) cell.classList.add("runner");
      mazeElement.appendChild(cell);
    }
  }
}

function startGame() {
  maze = genMaze(ROWS, COLS);
  start = [0,0];
  goal = [ROWS-1, COLS-1];
  player = [...start];
  moves = 0; movesEl.textContent = `Moves: ${moves}`;
  startTime = Date.now();
  timerEl.textContent = `Time: 00:00`;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 500);
  drawMaze();
}

function updateTimer() {
  const diff = Date.now() - startTime;
  const m = String(Math.floor(diff/60000)).padStart(2,'0');
  const s = String(Math.floor(diff%60000/1000)).padStart(2,'0');
  timerEl.textContent = `Time: ${m}:${s}`;
}

window.addEventListener("keydown", e => {
  const movesMap = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
  const mv = movesMap[e.key];
  if (mv) {
    const [dy,dx] = mv;
    const ny = player[0]+dy, nx = player[1]+dx;
    if (ny>=0 && ny<ROWS && nx>=0 && nx<COLS && maze[ny][nx]===0) {
      player = [ny,nx];
      moves++;
      movesEl.textContent = `Moves: ${moves}`;
      drawMaze();
      if (ny===goal[0] && nx===goal[1]) finish();
    }
  }
});

function finish() {
  clearInterval(timerInterval);
  alert(`🎉 ゴール！\n所要時間: ${timerEl.textContent.slice(6)}\n移動回数: ${moves}`);
}

respawnBtn.addEventListener("click", startGame);

// 初回起動
startGame();
