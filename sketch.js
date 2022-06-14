
//setup the economc parameters
const PARAMS = {
  speed: 5
};
let x = 0;

// setup the system parameters
let windowHeight, windowWidth;
let fps = 60,
fontSize = 50,
caption = "Econ Sim",
bgColor = "#FFFFF0";


//setup the paths for assets
let dinoPath;
let dinoPic;


//setup UI elements
var pane, sys;

// this is called before setsup
function preload() {
  dinoPath = 'assets/graphics/player/animation/dino-0.png';
}

//this is called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fps);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 
  dinoPic = loadImage(dinoPath);
  
  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addInput(PARAMS, 'speed', {min :0, max : 100});
}

//this is called every frame
function draw() {
  background(bgColor);
  image(dinoPic, x, windowHeight/2);
  x += PARAMS['speed'];
  if (x >= windowWidth){x=0;}
  frameRate(fps);

  pane.refresh();
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}

