const width = 720;
const height = 720;

let tsp;
let tspSol;
let headers = [];
let cities = [];

let fileMatches = false;

let x = 0;
let y = 0;
let t = 0;
let step = 0;
let trails = [];

function preload()
{
  tsp = loadStrings("TSP_EUC_Problems/ch150.tsp");
  tspSol = loadStrings("TSP_Solutions/ch150.sol");
}

function setup()
{
  createCanvas(width, height);

  // ------ process tsp header------ //
  for (let header=0; header<6; ++header)
    headers.push(tsp[header].trim().split(":"));
  console.log(headers);

  // ------ process tsp city ------ //
  for (let city=1; city<tsp.length-6; ++city)
  {
    let c = [];

    if (tsp[city+5].trim().split(" ")[0] == "EOF")
      break;

    for (fc of tsp[city+5].trim().split(" "))
      fc!='' ?  c.push(parseInt(fc)) : undefined;

    cities.push(c);
  }
  console.log(cities);

  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  let minXs =[], minYs = [], maxXs = [], maxYs = [];

  for (let i=0; i<cities.length; ++i)
  {
    minXs.push(cities[i][1]);
    minYs.push(cities[i][2]);
    maxXs.push(cities[i][1]);
    maxYs.push(cities[i][2]);
    minX = Math.min(...minXs);
    minY = Math.min(...minYs);
    maxX = Math.max(...maxXs);
    maxY = Math.max(...maxYs);
  }
  console.log(minX);
  console.log(minY);
  console.log(maxX);
  console.log(maxY);

for (let city=0; city<cities.length; ++city)
{
  cities[city][1] = map(cities[city][1], minX, maxX, 25, width-40);
  cities[city][2] = map(cities[city][2], minY, maxY, 25, height-40);
  console.log(cities[city][2]);
}

  if (headers[0][1].trim() == tspSol[0])
    fileMatches = true;
}

function draw()
{
  background(200);
  translate(20, 20);

  for (city of cities)
    circle(city[1], city[2], 3);

  textSize(15);
  for (header of headers) {
    header[0].trim() == "COMMENT" ? text(header[1], -17, -1) : undefined;
    header[0].trim() == "DIMENSION" ? text(header[1], -17, 15) : undefined;
  }

  if (t<1)
  {
    x = lerp(cities[tspSol[step+2]-1][1], cities[tspSol[step+3]-1][1], t);
    y = lerp(cities[tspSol[step+2]-1][2], cities[tspSol[step+3]-1][2], t);

    for (trail of trails)
      line(trail[0], trail[1], trail[2], trail[3]);
    line(cities[tspSol[step+2]-1][1], cities[tspSol[step+2]-1][2], x, y);
    t+=0.09;
  }
  else if (step < cities.length-2)
  {
    trails.push([cities[tspSol[step+2]-1][1], cities[tspSol[step+2]-1][2], x, y]);
    ++step;
    t=0;
  }

  line(cities[tspSol[step+2]-1][1], cities[tspSol[step+2]-1][2], x, y);
  for (trail of trails)
  {
      line(trail[0], trail[1], trail[2], trail[3]);
  }

  push();
  fill(255,0,0);
  circle(x, y, 2);
  pop();
}
