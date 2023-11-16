// title of the game to displayed on the title screen
title = "freeze cube";

// description, which is also displayed on the title screen
description = `Spacebar to jump. 
cube edges = points`;

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
  `
llllll
ll l l
ll l l
llllll
ll  ll
   `,
  // circle
  `
 lll
lllll
lllll
 lll
   `,
  `
 ll
l  l
l  l
 ll
   `,

  `
  LLLL
 LL/L
LLLLL
`,
`
g g g
g g g g
g g g
`,
];

// game design variable container
const G = {
  // game window
  WIDTH: 150,
  HEIGHT: 100,

  // bubble options
  BUBBLE_MIN_SPEED: 0.1,
  BUBBLE_MAX_SPEED: 0.6,
};

// Game runtime options
options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isCapturing: true, // capture a screen by pressing 'c' key
  captureCanvasScale: 2, // extra setting for isCapturingGameCanvasOnly, set scale of output file
  seed: 1, // starting state of random number generator for background music (BGM) and sound effects
  isPlayingBgm: true, // background music
  theme: "shapeDark",
  // TODO: uncomment depending on space and game size
  isReplayEnabled: true, // replays your run after game ends
};

// define variables
/** @type {{pos: Vector, vy: number, size: number}[]} */
let rects;
let nextRectDist;
/** @type {{pos: Vector, vel: Vector, isJumping: boolean}} */
let player;

let top_left;
let bottom_left;
let bottom_right;
let top_right;

function update() {
  if (!ticks) {
    // before game starts
    rects = [];
    nextRectDist = 0;
    addRect(60);
    addRect(40);
    addRect(20);

    // initialize player
    player = { pos: vec(75, 50), vel: vec(0, 0), isJumping: true };
  }

  // keep player within the screen
  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT + 8);

  // set rectangle speed and distance
  const RECTANGLE_SPEED = difficulty * rnd(0.1, 0.4);
  const DIFFERENCE = difficulty * 0.2;
  nextRectDist -= DIFFERENCE;

  if (nextRectDist < 0) {
    // add more rectangles when there are less on screen
    const size = addRect();
    nextRectDist = rnd(10, size); // set next rectangle distance
  }

  // remove and update rectangle locations
  remove(rects, (r) => {
    // move rectangles across screen
    if (difficulty > 3) {
      r.pos.y -= RECTANGLE_SPEED * 5;
    }
    if (difficulty > 2.75) {
      r.pos.x += RECTANGLE_SPEED * 4.5;
    }

    if (difficulty > 2.5) {
      r.pos.y += RECTANGLE_SPEED * 4;
    }

    if (difficulty > 2) {
      r.pos.x -= RECTANGLE_SPEED * 3;
    }

    // harder level: diagonal speed
    if (difficulty > 1.5) {
      r.pos.y += RECTANGLE_SPEED * 2;
    }

    if (difficulty > 1) {
      r.pos.y -= RECTANGLE_SPEED * 1.2;
    }

    // horizontal movement
    r.pos.x -= RECTANGLE_SPEED;

    // draw rectangle lines
    bottom_right = line(r.pos.x, r.pos.y + r.size, r.pos.x + r.size, r.pos.y);
    bottom_left = line(r.pos.x, r.pos.y + r.size, r.pos.x - r.size, r.pos.y);
    top_left = line(r.pos.x - r.size, r.pos.y, r.pos.x, r.pos.y - r.size);
    top_right = line(r.pos.x, r.pos.y - r.size, r.pos.x + r.size, r.pos.y);

    // when the player is in the rectangle
    if (char("f", player.pos).isColliding.rect.black) {
      addScore(0.01);
      color("light_green");
      particle(player.pos, 1, 5);
      player.vel = vec(5, 0);
    }

    // if outside of the left window frame
    return r.pos.x < -50;
  });

  // constantly update player position with velocity
  //player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  // console.log(player.pos);

  const INCREASE_VEL = 0.2;

  // constantly increment velocity
  player.vel.x += INCREASE_VEL;
  player.vel.y += INCREASE_VEL;

  // when key is pressed
  if (input.isJustPressed) {
    console.log("jumping");
    play("jump"); // jump sound effect
    player.vel.y = -3.5; // set velocity y to negative 
  }
  
  // render player
  char("f", player.pos, 50);

  // color of rectangles
  color("black");

  // player out of screen
  if (player.pos.y > G.HEIGHT + 7) {
    play("explosion");
    end();
  }
}

// create a randomized size rectangle
function addRect(y = 0) {
  const t = rnd() < 0.3;
  const size = t ? rnd(7, 12) : rnd(20, 30);
  const x = t ? rnd(10, 150) : 50 + rnds(40, 90 / difficulty);
  rects.push({ pos: vec(x, y + rnd(5, 90)), vy: 0, size });
  return size;
}

// TODO: add coins
