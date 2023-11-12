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
   `
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
// create moving bubbles on the screen that store position
// of object and speed
/** 
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Bubble
 */

// define initial bubbles array
/**
 * @type { Bubble [] }
 * 
 */
let bubbles;

// the game loop function
function update() {

    if (!ticks) {
        bubbles = times(10, () => {
            // random position
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
        
        // an object of type bubble with properties
        return {
            // create a vector
            pos: vec(posX, posY),
            speed: rnd(G.BUBBLE_MIN_SPEED, G.BUBBLE_MAX_SPEED)
        };
    });
    }

    // draw and update each bubble
    bubbles.forEach((b) => {
        // Move bubble to the left
        b.pos.x -= b.speed;
        // bring bubble back to the right once past left of screen
        b.pos.wrap(0, G.WIDTH, 0, G.HEIGHT * rnd(1.5, 2));

        // color to draw with
        color("black");
        // draw the bubble with a large size
        char("a", b.pos);
    })



    // // the init function running at startup
    // if (!ticks) {
    //     bubbles = [];
    //     nextBubbleDist = 0;    
    // }

    // // spawn bubbles
    // if (bubbles.length === 0) {
    //     // set bubble speed based on random generated number and increased difficulty
    //     currentBubbleSpeed = rnd(G.BUBBLE_MIN_BASE_SPEED, G.BUBBLE_MAX_BASE_SPEED) * difficulty;

    //     for (let i = 0; i < 9; i++) {
    //         const posX = rnd(0, G.WIDTH);
    //         const posY = -rnd(i * G.HEIGHT * 0.1);
    //         bubbles.push({
    //             pos: vec(posX, posY)
    //         });
    //     }
    // }
}