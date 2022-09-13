let map = [];

let grassTile;
let roadTile;
let startTile;
let carTile;

let grass;
let road;
let startLine;
let car;

let carRotation = 0;

function preload()
{
    map = loadStrings("track.txt");
    roadTile = loadImage("assets/desert_rocky_d.jpg", img => { img.width = 40; img.height = 40; });
    grassTile = loadImage("assets/grass_mix_ylw_d.jpg", img => { img.width = 40; img.height = 40; });
    startTile = loadImage("assets/stones_brown_d.jpg", img => { img.width = 40; img.height = 40; });

    carTile = loadImage("assets/car_red.png", img => { img.resize(img.width/9, img.height/9); });
}

function setup()
{
  let startbuffer = [];

  angleMode(DEGREES);
  createCanvas(600, 600);

  grass = new Group();
  road = new Group();
  startLine = new Group();

  let tileR = 0;
  for (let i of map)
  {
    let tileC = 0;

    for (let j of i)
    {
      switch (j)
      {
        case "0":
          let g = new Sprite(tileC*40+20,tileR*40,40,40);
          g.addImage(grassTile);
          grass.add(g);
          ++tileC;
          break;
        case "1":
          let r = new Sprite(tileC*40+20,tileR*40,40,40);
          r.addImage(roadTile);
          road.add(r);
          ++tileC;
          break;
        case "2":
          let s = new Sprite(tileC*40+20,tileR*40,40,40);
          s.addImage(startTile);
          road.add(s);
          startbuffer[0] = tileC*40+20;
          startbuffer[1] = tileR*40;
          ++tileC;
          break;
        default:
          break;
      }
    }
    ++tileR;
  }

  // car = new Sprite(60, 380, 20, 20);
  car = new Sprite(startbuffer[0], startbuffer[1], 20, 20);
  car.rotateToDirection = true;
  car.rotation = 270;
  car.addImage(carTile);
}

function draw()
{
  background(250);

  if (keyIsDown(LEFT_ARROW))
    carRotation-=2;
  if(keyIsDown(RIGHT_ARROW))
    carRotation+=2;
  if(keyIsDown(UP_ARROW))
    car.setVelocity(cos(car.rotation + carRotation), sin(car.rotation + carRotation));
  else if(keyIsDown(DOWN_ARROW))
  {
    car.rotateToDirection = false;
    car.setVelocity(-cos(car.rotation + carRotation), -sin(car.rotation + carRotation));
    car.rotation += carRotation;
  }
  else
  {
    car.rotateToDirection = true;
    car.setVelocity(0,0);
  }
  carRotation = 0;
  console.log(car.rotation);
  grass.draw();
  road.draw();
  startLine.draw();

  drawSprites();
}
