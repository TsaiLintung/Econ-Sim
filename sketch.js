let img;
let windowHeight, windowWidth;
let x;

function preload() {
  img = loadImage('assets/graphics/player/animation/dino-0.png')
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 
  x=0
}

function draw() {
  background(220);
  if(mouseIsPressed){pressed();}
  else{notpressed();}
  ellipse(mouseX,mouseY,80,80);
  image(img, x,windowHeight/2);
  x += 5;
  if (x >= windowWidth){x=0;}
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}