
//setup the parameters
var PARAMS = {
  speed: 2,
  size: 50,
  gifDelay:150,
  target_fps:60,
  fps:0,
  bgColor: "#FFFFF0",
  agentCount: 100, // my computer can run at 60fps with around 120 agents.
  discount: 0.999,
  coolDown: 120, // Cooldown for meeting is 90 frame
  logLength: 10
};
let windowHeight, windowWidth;

var OPTIONS ={
  id: 1 // the highlighed agent's id. 
}

//setup the paths for assets
const PATHS = {
  gdino:"assets/graphics/player/gdino-walk.gif",
  rdino:"assets/graphics/player/rdino-walk.gif",
  ydino:"assets/graphics/player/ydino-walk.gif"
};

// setup the playground for agents
var PLAYGROUND = {
  xmax: window.innerWidth,
  xmin:0,
  ymax: window.innerHeight,
  ymin:0
}

//initialize UI elements
var pane, sys;
var agentId = null, agentType, agentUtility ,agentPos, agentLog,hlAgent;

//define the production and utility functions
function consumptionGain(quantity){return quantity**(1/2)}
function productionCost(quantity){return -quantity/2}

//called before setup
function preload(){}

//called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(PARAMS.target_fps);
  imageMode(CENTER);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 

  //Initialize agents
  agents = new AgentList(PARAMS.size,PARAMS.speed,PATHS);
  agents.addAgents(PARAMS.agentCount);

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addMonitor(PARAMS, 'fps',{format: (v) => round(v)});
  sys.addMonitor(PARAMS, 'fps',{view: 'graph'});

  hlAgent = pane.addFolder({title:"Highlight Agent"});
  agents.updateHighlight(OPTIONS.id);
}

//called every frame
function draw() {
  background(PARAMS.bgColor);

  agents.update();
  agents.draw();
  
  PARAMS.fps = frameRate();

  //get the new values for the UI to work
  pane.refresh();
}





//called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  

  PLAYGROUND = {
    xmax: window.innerWidth,
    xmin:0,
    ymax: window.innerHeight,
    ymin:0
  }
}


//this is called when the mouse is clicked
function mouseClicked(){

  //if clicked on an agent, switch the highlight
  for (var i = 0; i < agents.list.length; i++) {
      if (agents.getAgent(i).pointCollide(mouseX, mouseY)){
        OPTIONS.id = i;
      }
  }
}


