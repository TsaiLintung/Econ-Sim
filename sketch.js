
//setup the economc parameters
var PARAMS = {
  speed: 2,
  size: 50,
  gifDelay:150,
  target_fps:60,
  fps:0,
  bgColor: "#FFFFF0",
  agentCount: 90,
};

// setup the system parameters
let windowHeight, windowWidth;

//setup the paths for assets
const PATHS = {
  gdino:"assets/graphics/player/gdino-walk.gif",
  rdino:"assets/graphics/player/rdino-walk.gif",
  ydino:"assets/graphics/player/ydino-walk.gif"
};

// setup the playground for agents
const playground = {
  xmax: window.innerWidth,
  xmin:0,
  ymax: window.innerHeight,
  ymin:0
}

//setup UI elements
var pane, sys;
var agentId, agentType, agentPos;

// this is called before setsup
function preload(){}

//this is called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(PARAMS.target_fps);
  imageMode(CENTER);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 

  //Initialize agents
  agents = new AgentList(PARAMS.size,PARAMS.speed,PATHS,playground);
  agents.addAgents(PARAMS.agentCount);

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addMonitor(PARAMS, 'fps',{format: (v) => round(v)});
  sys.addMonitor(PARAMS, 'fps',{view: 'graph'});

  hlAgent = pane.addFolder({title:"Highlight Agent"});
  agentId = hlAgent.addMonitor(agents.getHightlight(), 'id',{format: (v) => round(v)});
  agentType = hlAgent.addMonitor(agents.getHightlight(), 'type');
  agentPos = hlAgent.addInput(agents.getHightlight(), "pos", { x: {min: playground.xmin, max: playground.xmax}, y: {min: playground.ymin, max: playground.ymax}});
  agents.getAgent(0).highlight = true;
}

//this is called every frame
function draw() {
  background(PARAMS.bgColor);

  agents.update();
  agents.draw();
  
  PARAMS.fps = frameRate();

  pane.refresh();
  
  
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  

  playground = {
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
        agents.getAgent(agents.hightlightIndex).highlight = false;
        agents.hightlightIndex = i;
        agents.getAgent(i).highlight = true;

        agentId.dispose();
        agentType.dispose();
        agentPos.dispose();

        agentId = hlAgent.addMonitor(agents.getHightlight(), 'id',{format: (v) => round(v)});
        agentType = hlAgent.addMonitor(agents.getHightlight(), 'type');
        agentPos = hlAgent.addInput(agents.getHightlight(), "pos", { x: {min: playground.xmin, max: playground.xmax}, y: {min: playground.ymin, max: playground.ymax}});

      }
  }

}


