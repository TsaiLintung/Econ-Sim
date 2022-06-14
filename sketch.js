
//setup the economc parameters
const PARAMS = {
  speed: 5,
  fps:60,
  bgColor: "#FFFFF0"
};
let x = 0;

// setup the system parameters
let windowHeight, windowWidth;


//setup the paths for assets
const PATHS = {
  'dino': 'assets/graphics/player/animation/dino-0.png'
};

//setup UI elements
var pane, sys;

// this is called before setsup
function preload() {}

//this is called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(PARAMS.fps);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 

  agent = new Agent(10, 500, PARAMS.speed, PATHS.dino);

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addInput(PARAMS, 'speed', {min :0, max : 10});
  sys.addInput(PARAMS, 'fps', {min :30, max : 120});

  focusAgent = pane.addFolder({title:"Focus Agent"});
  focusAgent.addMonitor(agent.pos, 'x')
  focusAgent.addMonitor(agent.pos, 'y')
}

//this is called every frame
function draw() {
  background(PARAMS.bgColor);

  agent.update();
  image(agent.pic, agent.pos.x, agent.pos.y);
  
  frameRate(PARAMS.fps);
  agent.speed = PARAMS.speed;
  pane.refresh();
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}

