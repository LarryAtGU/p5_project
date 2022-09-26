// game of life
const UV_WIDE = 500;
const UV_HIGH = 300; // the size of universe
const FIG_HIGH = 100;
const FIG_RANGE = UV_WIDE;
const UV_OFFSET = 10;

const fgL = UV_OFFSET; // figure area.
const fgT = UV_HIGH + 2 * UV_OFFSET;
const fgB = fgT + FIG_HIGH;
const fgR = fgL + FIG_RANGE;

const GRASS_MAX = 100; // the maximum value of grass in a point.
const GRASS_GROW_RATE = 5; // the higher, the higher chance to graw 100 means 100%
const GRASS_SEED_NUM = 1000;
const GRASS_SEED_RANGE = 5;
const GRASS_SEED_LEVEL = 30;
const DRAW_GRASS_SIZE = 5; // EVERY SQUARE WILL BE 10 * 10 IF IT IS 10
const MID_COLOR = 155;

const MAX_SHEEP_DENSITY = 0.01; // every piexl can have 0.01 sheep
const INIT_SHEEP_NUM = 15; // the initial sheep num
const INIT_SHEEP_GEN = 50; // sheep appear after 50 generation.
const SHEEP_CHANGE_DIR_RATE = 5; // how likely a sheep will change moving direction
const SHEEP_EAT_VOL = 50;
const SHEEP_BORN_RATE = 5;
const SHEEP_LIFE = 100;
const SHEEP_DIE_RATE = 20;
const SHEEP_SPEED = 2;

const MAX_WOLF_DENSITY = 0.001; // every piexl can have 0.001 WOLF
const WOLF_HUNGARY = 80; // helth less than it start to find sheep and eat.
const WOLF_HUNGARY_SPEED = 5; // helth reduce for every round without eating
const WOLF_SPEED = 5;
const WOLF_BORN_RATE = 1;
const WOLF_EATEN_DISTANCE = 3; // how far a wolf can eat.
const WOLF_SEARCH_DISTANCE = 50; // how far a wolf can search.
const WOLF_DIE_RATE = 10;
const INIT_WOLF_NUM = 5; // the initial WOLF num
const INIT_WOLF_GEN = 100; // WOLF appear after 100 generation.

const grass = [];
let sheep = [];
let wolf = [];
let grassTotal;
let generation;
const history = [];

class Animal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.health = 100;
    this.direction = randNum(4);
    this.alive = true;
  }
  isAlive() {
    return this.alive;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getHealth() {
    return this.health;
  }
  getAge() {
    return this.age;
  }
  setX(x) {
    this.x = x;
  }
  setY(y) {
    this.y = y;
  }
  grow() {
    this.age++;
  }
}

class Wolf extends Animal {
  constructor(x, y) {
    super(x, y);
  }
  eat() {
    this.health -= WOLF_HUNGARY_SPEED;
    if (this.health < 0) this.health = 0;
    //    if(this.health>WOLF_HUNGARY) return; // no need to eat
    const sp = sheep.find(
      (sp) =>
        Math.abs(sp.getX() - this.x) <= WOLF_EATEN_DISTANCE &&
        Math.abs(sp.getY() - this.y) <= WOLF_EATEN_DISTANCE
    );
    if (!sp) return; // nothing to eat.
    sp.eaten();
    this.health = 100;
  }
  born() {
    if (this.age < 20 || this.health < WOLF_HUNGARY) return;
    if (randNum() < WOLF_BORN_RATE) {
      const wf = new Wolf(getColNum(this.x + 2), getRowNum(this.y + 2));
      wolf.push(wf);
    }
  }
  die() {
    if (this.health <= 0) {
      if (randNum() < WOLF_DIE_RATE) {
        this.alive = false;
      }
    }
  }
  moveAround() {
    switch (this.direction) {
      case 0:
        this.x = getColNum(this.x + WOLF_SPEED);
        break;
      case 1:
        this.x = getColNum(this.x - WOLF_SPEED);
        break;
      case 2:
        this.y = getRowNum(this.y + WOLF_SPEED);
        break;
      case 3:
        this.y = getRowNum(this.y - WOLF_SPEED);
        break;
    }
    if (this.health < WOLF_HUNGARY) {
      const sp = sheep.find(
        (sp) =>
          Math.abs(sp.getX() - this.x) <= WOLF_SEARCH_DISTANCE &&
          Math.abs(sp.getY() - this.y) <= WOLF_SEARCH_DISTANCE
      );
      if (!sp) return; // find nothing.

      const xdiff = sp.getX() - this.x;
      const ydiff = sp.getY() - this.y;
      if (Math.abs(xdiff) > Math.abs(ydiff)) {
        if (xdiff > 0) this.direction = 0;
        else this.direction = 1;
      } else {
        if (ydiff > 0) this.direction = 2;
        else this.direction = 3;
      }
    }
  }
}

class Sheep extends Animal {
  constructor(x, y) {
    super(x, y);
  }
  eat() {
    const x = this.x;
    const y = this.y;
    const searchArea = [
      [getColNum(x + 1), y],
      [getColNum(x - 1), y],
      [x, getRowNum(y + 1)],
      [x, getRowNum(y - 1)],
      [x, y],
    ];
    let needfood = SHEEP_EAT_VOL;
    while (needfood > 0 && searchArea.length > 0) {
      const [xx, yy] = searchArea.pop();
      let food = grass[yy][xx];
      if (food > needfood) {
        food -= needfood;
        needfood = 0;
      } else {
        needfood -= food;
        food = 0;
      }
      grass[yy][xx] = food;
    }
    if (needfood > 0) {
      this.health -= needfood / 5;
      if (this.health < 0) this.health = 0;
    } else {
      this.health += 10;
      if (this.health > 100) this.health = 100;
    }
  }
  eaten() {
    this.alive = false;
  }

  born() {
    if (this.age < 10 || this.health < 100) return;
    if (randNum() < SHEEP_BORN_RATE) {
      const sp = new Sheep(getColNum(this.x + 2), getRowNum(this.y + 2));
      sheep.push(sp);
    }
  }
  die() {
    if (this.age > SHEEP_LIFE || this.healty == 0) {
      if (randNum() < SHEEP_DIE_RATE) this.alive = false;
    }
  }
  moveAround() {
    switch (this.direction) {
      case 0:
        this.x = getColNum(this.x + SHEEP_SPEED);
        break;
      case 1:
        this.x = getColNum(this.x - SHEEP_SPEED);
        break;
      case 2:
        this.y = getRowNum(this.y + SHEEP_SPEED);
        break;
      case 3:
        this.y = getRowNum(this.y - SHEEP_SPEED);
        break;
    }
    if (randNum() < SHEEP_CHANGE_DIR_RATE) this.direction = randNum(4);
  }
}

const initSheep = () => {
  for (let i = 0; i < INIT_SHEEP_NUM; ++i) {
    let sp = new Sheep(randNum(UV_WIDE), randNum(UV_HIGH));
    sheep.push(sp);
  }
};
const initWolf = () => {
  for (let i = 0; i < INIT_WOLF_NUM; ++i) {
    let wf = new Wolf(randNum(UV_WIDE), randNum(UV_HIGH));
    wolf.push(wf);
  }
};

const initGrass = () => {
  for (let i = 0; i < UV_HIGH; ++i) {
    grass.push(new Array(UV_WIDE));
  }

  for (let x = 0; x < UV_WIDE; ++x) {
    for (let y = 0; y < UV_HIGH; ++y) {
      grass[y][x] = 0;
    }
  }

  for (let i = 0; i < GRASS_SEED_NUM; ++i) {
    grassSeed(
      randNum(UV_WIDE),
      randNum(UV_HIGH),
      GRASS_SEED_RANGE,
      GRASS_SEED_LEVEL
    );
  }
};

const randNum = (n = 100) => {
  return Math.floor(random() * n);
};
const getRowNum = (x) => {
  return (x + UV_HIGH) % UV_HIGH;
};
const getColNum = (x) => {
  return (x + UV_WIDE) % UV_WIDE;
};
const grassSeed = (x, y, r, l) => {
  // x, y position, r: range, l: level
  for (let i = x - r; i < x + r; ++i) {
    for (let j = y - r; j < y + r; ++j) {
      grass[getRowNum(j)][getColNum(i)] =
        grass[getRowNum(j)][getColNum(i)] +
          Math.round(0.5 * l + (random() * l) / 2) ||
        Math.round(0.5 * l + (random() * l) / 2);
      if (grass[getRowNum(j)][getColNum(i)] > GRASS_MAX)
        grass[getRowNum(j)][getColNum(i)] = GRASS_MAX;
    }
  }
};
function setup() {
  createCanvas(UV_WIDE + UV_OFFSET * 2, UV_HIGH + FIG_HIGH + UV_OFFSET * 6);
  initSheep();
  initWolf();
  initGrass();
  generation = 0;
}
function drawBoard() {
  fill(MID_COLOR);
  rect(10, 10, UV_WIDE, UV_HIGH);
}
function grassGrow() {
  for (let x = 0; x < UV_WIDE; ++x) {
    for (let y = 0; y < UV_HIGH; ++y) {
      if (grass[y][x] > 0 && randNum() < GRASS_GROW_RATE) {
        grass[y][getColNum(x + 1)]++;
        grass[y][getColNum(x - 1)]++;
        grass[getRowNum(y + 1)][x]++;
        grass[getRowNum(y - 1)][x]++;
      }
      if (grass[y][x] > GRASS_MAX) grass[y][x] = GRASS_MAX;
    }
  }
}

function drawGrass() {
  const row = UV_HIGH / DRAW_GRASS_SIZE;
  const col = UV_WIDE / DRAW_GRASS_SIZE;
  push();
  noStroke();
  for (let r = 0; r < row; ++r) {
    for (c = 0; c < col; ++c) {
      let gt = 0;
      for (let x = c * DRAW_GRASS_SIZE; x < (c + 1) * DRAW_GRASS_SIZE; ++x) {
        for (let y = r * DRAW_GRASS_SIZE; y < (r + 1) * DRAW_GRASS_SIZE; ++y) {
          gt += grass[y][x];
        }
      }
      gt = Math.floor(gt / (DRAW_GRASS_SIZE * DRAW_GRASS_SIZE));
      fill(MID_COLOR - gt, MID_COLOR + gt, MID_COLOR - gt);
      square(
        UV_OFFSET + c * DRAW_GRASS_SIZE,
        UV_OFFSET + r * DRAW_GRASS_SIZE,
        DRAW_GRASS_SIZE
      );
    }
  }
  pop();
}
function calStat() {
  grassTotal = grass.reduce((ret, r) => r.reduce((res, c) => res + c, ret), 0);
  let pregrass = 0;
  if (history.length > 0) {
    pregrass = history[history.length - 1]["grassTotal"];
  }
  history.push({
    generation,
    grassTotal,
    grassGrow: grassTotal - pregrass,
    sheepNum: sheep.length,
    wolfNum: wolf.length,
  });
  generation++;
}
function drawSheep(sp) {
  push();
  const age = sp.getAge();
  let d = 2;
  if (age > 5) d = 3;
  if (age > 10) d = 4;
  if (age > 20) d = 5;
  if (age > 30) d = 6;
  const health = sp.getHealth();
  let c = 55 + health * 2;
  fill(c);
  stroke(0);
  circle(sp.getX() + UV_OFFSET, sp.getY() + UV_OFFSET, d);
  pop();
}

function drawWolf(wf) {
  push();
  const health = wf.getHealth();
  const x = wf.getX() + UV_OFFSET;
  const y = wf.getY() + UV_OFFSET;
  let mid = 150;
  fill(mid + 100 - health, mid + health - 100, mid + health - 100);
  stroke(0);

  triangle(x - 3, y + 2, x + 3, y + 2, x, y - 4);
  pop();
}

function runWolf(wf) {
  wf.moveAround();
  wf.eat();
  wf.grow();
  if (wolf.length < MAX_WOLF_DENSITY * UV_HIGH * UV_WIDE) wf.born();
  wf.die();
}

function runSheep(sp) {
  sp.moveAround();
  sp.eat();
  sp.grow();
  if (sheep.length < MAX_SHEEP_DENSITY * UV_HIGH * UV_WIDE)
    // not no many sheep
    sp.born();
  sp.die();
}
function drawWolfs() {
  wolf = wolf.filter((wf) => wf.isAlive());
  wolf.forEach((wf) => {
    runWolf(wf);
    drawWolf(wf);
  });
}

function drawSheeps() {
  sheep = sheep.filter((sp) => sp.isAlive());
  sheep.forEach((sp) => {
    runSheep(sp);
    drawSheep(sp);
  });
}
function getFigTop(n) {
  let div = 1;
  let test = n;
  while (test > 10) {
    div *= 10;
    test /= 10;
  }
  return (Math.floor(n / div) + 1) * div;
}
function getFigY(v, t) {
  const fgT = UV_HIGH + 2 * UV_OFFSET;
  const fgB = fgT + FIG_HIGH;
  return lerp(fgB, fgT, v / t);
}
function drawFig() {
  if (history.length < 3) return;
  let start, end;
  if (generation > FIG_RANGE) {
    start = generation - FIG_RANGE;
    end = generation;
  } else {
    start = 0;
    end = generation;
  }

  const drawCurve = (nm, st, end, Top, col) => {
    stroke(col[0], col[1], col[2]);
    let s = history[st][nm];
    let y0 = getFigY(s, Top);
    let x0 = fgL;
    for (let i = st + 1; i < end - 1; ++i) {
      const y1 = getFigY(history[i][nm], Top);
      line(x0, y0, x0 + 1, y1);
      x0++;
      y0 = y1;
    }
  };
  const [gM, sM, wM] = history.reduce(
    (ret, cur, idx) => {
      if (idx < start) return ret;
      if (cur.grassTotal > ret[0]) ret[0] = cur.grassTotal;
      if (cur.sheepNum > ret[1]) ret[1] = cur.sheepNum;
      if (cur.wolfNum > ret[2]) ret[2] = cur.wolfNum;
      return ret;
    },
    [0, 0, 0]
  );

  const gT = getFigTop(gM);
  const sT = getFigTop(sM);
  const wT = getFigTop(wM);

  push();
  stroke(0);
  text("Grass", fgL, fgB + UV_OFFSET + 2);
  text("Sheep/Wolf", fgR - 70, fgB + UV_OFFSET + 2);
  text("" + gT, fgL + 2, fgT + 5);
  const str = "" + sT + "/" + wT;
  text(str, fgR - str.length * 8, fgT + 5);
  line(fgL, fgT, fgL, fgB);
  line(fgL, fgB, fgR, fgB);
  line(fgR, fgT, fgR, fgB);
  drawCurve("grassTotal", start, end, gT, [0, 200, 0]);
  drawCurve("sheepNum", start, end, sT, [255, 255, 255]);
  drawCurve("wolfNum", start, end, wT, [128, 0, 0]);
  pop();
}
function drawInfo() {
  const info = history[history.length - 1];

  push();
  stroke(0);
  text(
    "Grass: " +
      info.grassTotal +
      " Sheep: " +
      info.sheepNum +
      " Wolf: " +
      info.wolfNum,
    fgL,
    fgB + UV_OFFSET * 2 + 4
  );
  pop();
}
function draw() {
  const t0 = Date.now();
  background(220);
  drawBoard();
  drawFig();
  const t01 = Date.now();

  grassGrow();
  const t02 = Date.now();

  // if (drawGrassCounter <= 0) {
  drawGrass();
  //   drawGrassCounter = DRAW_GRASS_CYCLE;
  // }
  // drawGrassCounter--;

  const t1 = Date.now();
  drawSheeps();
  const t2 = Date.now();

  drawWolfs();
  const t3 = Date.now();

  calStat();
  if (generation === INIT_SHEEP_GEN) initSheep();
  if (generation === INIT_WOLF_GEN) initWolf();
  drawInfo();
  const t4 = Date.now();
  // console.log(
  //   "o:",
  //   t01 - t0,
  //   "gg:",
  //   t02 - t01,
  //   "dg:",
  //   t1 - t02,
  //   "s:",
  //   t2 - t1,
  //   "w:",
  //   t3 - t2,
  //   "c:",
  //   t4 - t3
  // );
  // console.log(history[history.length - 1]);
}
