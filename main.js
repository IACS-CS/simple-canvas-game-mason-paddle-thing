/* Main game file: main.js */
/* Game: Paddle smaker */
/* Authors: Mason Januskiewicz] */
/* Description: use paddle to smack ball that starts at top of screen */
/* Citations: most likely going to use ai I am putting this here ahead of time */
/* Note: If you use significant AI help you should cite that here as well */
/* including summaries of prompts and/or interactions you had with the AI */
/* In addition, of course, any AI-generated code should be clearly maked */
/* in comments throughout the code, though of course when using e.g. CoPilot */
/* auto-complete it maye be impractical to mark every line, which is why you */
/* should also include a summary here */

import "./style.css";

import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

// make a topbar that has the name of the game and a button with instructions
//used teachers template for this
let topbar = gi.addTopBar();
topbar.addTitle("Paddle Smacker");
topbar.addButton({
  text: "Instructions",
  // The simple-canvas-library expects `onclick` (lowercase).
  // Code generated with the help of GitHub Copilot in this session.
  onclick: function () {
    gi.dialog(
      "Instructions",
      "Use the left and right arrow keys or click(you need to click once before you can use the arrow keys) on the left/right side of the screen to move the paddle. Smack the falling ball with the paddle to score points. If the ball falls off the bottom of the screen, the game is over."
    );
  },
});
/* Variables: Top-Level variables defined here are used to hold game state */
//Paddle
let paddleSizeSet = false;
let paddlex = gi.width / 2; //starting position
let Paddley = gi.height + 30; // fixed hieght
//are subject to change as needed these are just arbitary numbers
let paddlewidth = 80;
let paddleheight = 10;
let paddlevelocity = 0;
let paddleacceleration = 2;

// falling object
let objectx = 0;
let objecty = 0;
let objectspeed = 50;
let objectradius = 7;

// game state
let gameOver = false;

//scoreboard
let score = 0;

/* Drawing Functions */

/* Example drawing function: you can add multiple drawing functions */
/*that will be called in sequence each frame. It's a good idea to do */
/*one function per each object you are putting on screen, and you */
/*may then want to break your drawing function down into sub-functions */
/* to make it easier to read/follow */
gi.addDrawing(function drawpaddle({ ctx, width, height, elapsed, stepTime }) {
  //got helpt from teacher will put in citation later
  if (!paddleSizeSet) {
    //set paddle size based on screen size
    paddlewidth = width / 10;
    paddleheight = height / 40;
    // set position
    Paddley = height - paddleheight - 10;
    paddlex = (width - paddlewidth) / 2;
    paddleSizeSet = true;
    //again teacher helped me with this part
    objectx = Math.random() * width;
    // add velocity to paddle and movemnet left and right based on keys
  }
  // Your drawing code here...
  ctx.fillStyle = "blue";
  ctx.fillRect(paddlex, Paddley, paddlewidth, paddleheight);
  //AI helped me with this part as well
  // Apply paddle velocity to position each frame, with simple friction and bounds
  // scale velocity by frame time so movement is framerate independent
  paddlex += paddlevelocity * (stepTime / 16);
  // apply simple friction so velocity decays over time
  paddlevelocity *= 0.98;
  // clamp paddle to canvas bounds
  if (paddlex < 0) {
    paddlex = 0;
    paddlevelocity = 0;
  } else if (paddlex + paddlewidth > width) {
    paddlex = width - paddlewidth;
    paddlevelocity = 0;
  }
});

// DRAW BALL + COLLISION + SCORE
gi.addDrawing(function drawobject({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "purple";
  ctx.beginPath();
  ctx.arc(objectx, objecty, objectradius, 0, Math.PI * 2);
  ctx.fill();

  // Update object falling
  objecty += objectspeed * (stepTime / 1000);
  objectspeed += 10 * (stepTime / 1000);
  //AI did this for me I started doing work and asked it what to do and it said this was better so I just went with it.
  // Collision Detection
  // Check if the ball is overlapping with the paddle by testing all four sides
  let hitPaddle =
    // Check if ball's bottom edge has reached or passed paddle's top edge
    objecty + objectradius >= Paddley &&
    // Check if ball's top edge hasn't gone past paddle's bottom edge
    objecty - objectradius <= Paddley + paddleheight &&
    // Check if ball's x position is at or past paddle's left edge
    objectx >= paddlex &&
    // Check if ball's x position is at or before paddle's right edge (all conditions must be true)
    objectx <= paddlex + paddlewidth;

  if (hitPaddle) {
    // Increase score
    score++;

    // Reset ball to random top position
    objectx = Math.random() * width;
    objecty = 0;
    objectspeed += 7.5; // increase speed for difficulty
  }

  // If ball falls off screen its game over
  //AI told me gi.diioalog is a thing and to use location.reload to restart
  if (objecty > height) {
    gi.stop();
    gi.dialog("Game Over!", "The ball fell off the screen!", () => {
      location.reload();
    });
  }
});
//idk how but auto fill did this
// DRAW SCORE
gi.addDrawing(function drawScore({ ctx }) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
});

// Input Handlers

// Example: Mouse click handler (you can change to handle
//any type of event -- keydown, mousemove, etc)

gi.addHandler("click", function ({ event, x, y }) {
  // Use the canvas-local `x` provided by the handler (not event.clientX)
  // and push the paddle by changing its velocity. This makes control
  // intentionally a bit 'slippery' because we add velocity instead of
  // setting position directly.
  if (x < paddlex + paddlewidth / 2) {
    // move left
    paddlevelocity -= paddleacceleration;
  } else {
    // move right
    paddlevelocity += paddleacceleration;
  }
});
//got help from teacher on this part as well
gi.getContainer().querySelector("canvas").tabIndex = 1000; // make canvas focusable
gi.getContainer().querySelector("canvas").focus(); // focus canvas to receive key events
gi.addHandler("keydown", function ({ event }) {
  if (event.key === "ArrowLeft") {
    // move left
    paddlevelocity -= paddleacceleration;
  } else if (event.key === "ArrowRight") {
    // move right
    paddlevelocity += paddleacceleration;
  }
});

// Run the game
gi.run();
