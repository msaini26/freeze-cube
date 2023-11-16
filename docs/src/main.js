// title of the game to displayed on the title screen
title = "freeze cube";

// description, which is also displayed on the title screen
description = `Spacebar to jump. 
cube edges = points`;

// The array of custom sprites
characters = [
  // circle
  `
  rr
 rrrr
rrrrrr
rrrrrr
 rrrr
  rr
   `,

`
g g g 
g g g
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

// rectangle lines
let top_left;
let bottom_left;
let bottom_right;
let top_right;

// bullets
/** @type {{pos: Vector, vx: number}[]} */
let bullets;
let nextBulletDist;

function update() {
  if (!ticks) {
    // before game starts

    // rectangles
    rects = [];
    nextRectDist = 0;
    addRect(60);
    addRect(40);
    addRect(20);

    // initialize player
    player = { pos: vec(75, 50), vel: vec(0, 0), isJumping: true };

    // bullets
    bullets = [];
    nextBulletDist = 99;
  }

  // keep player within the screen
  player.pos.clamp(0, G.WIDTH, -20, G.HEIGHT + 8);

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
      r.pos.y -= RECTANGLE_SPEED * 7;
    }
    if (difficulty > 2.75) {
      r.pos.x += RECTANGLE_SPEED * 5.5;
    }

    if (difficulty > 2.5) {
      r.pos.y += RECTANGLE_SPEED * 5;
    }

    if (difficulty > 2) {
      r.pos.x -= RECTANGLE_SPEED * 4;
    }

    // harder level: diagonal speed
    if (difficulty > 1.5) {
      r.pos.y += RECTANGLE_SPEED * 3;
    }

    if (difficulty > 1) {
      r.pos.y -= RECTANGLE_SPEED * 1.5;
    }

    // horizontal movement
    r.pos.x -= RECTANGLE_SPEED;

    // draw rectangle lines
    bottom_right = line(r.pos.x, r.pos.y + r.size, r.pos.x + r.size, r.pos.y);
    bottom_left = line(r.pos.x, r.pos.y + r.size, r.pos.x - r.size, r.pos.y);
    top_left = line(r.pos.x - r.size, r.pos.y, r.pos.x, r.pos.y - r.size);
    top_right = line(r.pos.x, r.pos.y - r.size, r.pos.x + r.size, r.pos.y);

    // when the player is in the rectangle
    if (char("b", player.pos).isColliding.rect.black) {
      addScore(0.04);
      color("light_green");
      particle(player.pos, 1, 5);
      player.vel = vec(5, 0);
    }

    // if outside of the left window frame
    return r.pos.x < -50 || r.pos.x > 200 || r.pos.y < -50 || r.pos.y > 150;
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
    player.vel.y = -2; // set velocity y to negative 
  }
  
  // double render player for squish effect
  char("b", player.pos, 50);

  // color of rectangles
  color("black");

  // player out of screen
  if (player.pos.y > G.HEIGHT + 7 || player.pos.y < 0) {
    play("explosion");
    end();
  }

  nextBulletDist -= sqrt(difficulty);
  if (nextBulletDist < 10) {
    bullets.push({ pos: vec(203, rndi(10, 90)), vx: rnd(1, difficulty) * 0.3 });
    nextBulletDist += rnd(50, 80) / sqrt(difficulty);
  }
  color("black");
  remove(bullets, (b) => {
    b.pos.x -= b.vx + sqrt(difficulty);
    const c = char("a", b.pos).isColliding.char.b;
    if (c) {
        play("explosion");
        end();
      }
   return b.pos.x < -3;
  });

}

// create a randomized size rectangle
function addRect(y = 0) {
  const t = rnd() < 0.3;
  const size = t ? rnd(7, 12) : rnd(20, 30);
  const x = t ? rnd(10, 150) : 50 + rnds(40, 90 / difficulty);
  rects.push({ pos: vec(x, y + rnd(5, 90)), vy: 0, size });
  return size;
}
