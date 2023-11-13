// title of the game to displayed on the title screen
title = "bubble speed";

// description, which is also displayed on the title screen
description = 
`Spacebar to jump.`;

// The array of custom sprites
characters = [
    `
    llll
   l    l
   ll  ll
   l    l
   l ll l
    llll 
   `,
     // circle
     `
    ll
   llll
   llll
    ll
   `,
     `
    ll
   l  l
   l  l
    ll
   `,

]

// game design variable container
const G = {
    // game window
    WIDTH: 150,
    HEIGHT: 100,

    // bubble options
    BUBBLE_MIN_SPEED: 0.1,
    BUBBLE_MAX_SPEED: 0.6
};

// Game runtime options
options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true, // capture a screen by pressing 'c' key
    captureCanvasScale: 2, // extra setting for isCapturingGameCanvasOnly, set scale of output file
    seed: 1, // starting state of random number generator for background music (BGM) and sound effects
    isPlayingBgm: true, // background music
    // theme: "shapeDark", 
    // TODO: uncomment depending on space and game size
    isReplayEnabled: true, // replays your run after game ends
};

// define variables
/** @type {{pos: Vector, vy: number, size: number}[]} */
let rects;
let nextRectDist;
/** @type {{x: number, vy: number}} */
let ship;

function update() {
  if (!ticks) {
    rects = [];
    nextRectDist = 0;
    addRect(60);
    addRect(40);
    addRect(20);
  }

  // set rectangle speed and distance 
  const RECTANGLE_SPEED = difficulty * rnd(0.01, 0.4);
  const DIFFERENCE = difficulty * 0.2;
  nextRectDist -= DIFFERENCE;

  if (nextRectDist < 0) { // add more rectangles when there are less on screen
    const size = addRect();
    nextRectDist = rnd(10, size); // set next rectangle distance
  }

  // remove and update rectangle locations
  remove(rects, (r) => {

    // move rectangles across screen
    // harder level: diagonal speed
    if (difficulty > 3) {
        r.pos.y += RECTANGLE_SPEED;
    }
    
    // horizontal movement
    r.pos.x -= RECTANGLE_SPEED;

    // draw rectangle lines
    line(r.pos.x , r.pos.y + r.size, r.pos.x  + r.size, r.pos.y);
    line(r.pos.x, r.pos.y + r.size, r.pos.x - r.size, r.pos.y);
    line(r.pos.x - r.size, r.pos.y, r.pos.x, r.pos.y - r.size);
    line(r.pos.x, r.pos.y - r.size, r.pos.x + r.size, r.pos.y);
  });

  // color of rectangles
  color("black");

 
  // create a randomized size rectangle
  function addRect(y = 0) {
    const t = rnd() < 0.3;
    const size = t ? rnd(7, 12) : rnd(20, 30);
    const x = t ? rnd(10, 150) : 50 + rnds(40, (90 / difficulty));
    rects.push({ pos: vec(x, y + rnd(5, 90)), vy: 0, size });
    return size;
  }
}