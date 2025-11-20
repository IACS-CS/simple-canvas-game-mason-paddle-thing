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
let paddlespeed = 8;

//falling object
// falling object
let objectx = 0;
let objecty = 0;
let objectspeed = 25;
let objectradius = 5;

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

  }
  // Your drawing code here...
  ctx.fillStyle = "blue";
  ctx.fillRect(paddlex, Paddley, paddlewidth, paddleheight);
});

gi.addDrawing(function drawobject({ ctx, width, height, elapsed, stepTime }) {

  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(objectx, objecty, objectradius, 0, Math.PI * 2);
  ctx.fill();
  //update object position
  objecty += objectspeed * (stepTime / 1000);
  //reset object if it goes off screen
  if (objecty > height) {
    objecty = 0;
    objectx = Math.random() * width;
  }
});

/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

gi.addHandler("click", function ({ event, x, y }) {
  // Your click handling code here...
});

/* Run the game */
gi.run();
