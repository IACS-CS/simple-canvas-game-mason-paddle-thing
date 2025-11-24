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
let objectradius = 5;

// game state
let gameOver = false;

/* Drawing Functions */

/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */
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

gi.addDrawing(function drawobject({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(objectx, objecty, objectradius, 0, Math.PI * 2);
  ctx.fill();
  //update object position
  objecty += objectspeed * (stepTime / 1000);
  //check if object fell off screen
  if (objecty > height) {
    // Game over and relode page to restart
    gi.stop();
    gi.dialog("Game Over!", "The ball fell off the screen!", () => { 
      //auto complete did this 
      location.reload();
    });
  }
  // gravity effect I think
  objectspeed += 10 * (stepTime / 1000);
});

/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

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
gi.addHandler("keydown", function ({ event }) {
  if (event.key === "ArrowLeft") {
    // move left
    paddlevelocity -= paddleacceleration;
  } else if (event.key === "ArrowRight") {
    // move right
    paddlevelocity += paddleacceleration;
  }
});

/* Run the game */
gi.run();
