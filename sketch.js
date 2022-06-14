
//setup the economc parameters
const PARAMS = {
  speed: 5,
  fps:60,
  bgColor: "#FFFFF0",
  agentCount: 10,
};

// setup the system parameters
let windowHeight, windowWidth;

//setup the paths for assets
const PATHS = {
  dino:"assets/graphics/player/animation/dino-0.png"
};

const playground = {
  xmax: window.innerWidth,
  xmin:0,
  ymax: window.innerHeight,
  ymin:0
}

//setup UI elements
var pane, sys;

// this is called before setsup
function preload(){}

//this is called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(PARAMS.fps);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 

  agents = new AgentList(50,PARAMS.speed,PATHS.dino,playground);

  for (i = 0; i <PARAMS.agentCount; i++) {agents.addAgent();}

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addInput(PARAMS, 'speed', {min :0, max : 10});
  sys.addInput(PARAMS, 'fps', {min :30, max : 120});

  focusAgent = pane.addFolder({title:"Focus Agent"});
  focusAgent.addMonitor(agents.getAgent(0), 'id')
  focusAgent.addMonitor(agents.getAgent(0).pos, 'x')
  focusAgent.addMonitor(agents.getAgent(0).pos, 'y')
}

//this is called every frame
function draw() {
  background(PARAMS.bgColor);

  agents.update();
  agents.draw();
  
  frameRate(PARAMS.fps);
  //agent.speed = PARAMS.speed;
  pane.refresh();
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}

