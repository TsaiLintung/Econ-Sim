
//setup the parameters
var PARAMS = {
  speed: 2,
  size: 50,
  gifDelay:150,
  target_fps:60,
  fps:0,
  bgColor: "#FFFFF0",
  agentCount: 100, // my computer can run at 60fps with around 120 agents.
  discount: 0.999
};
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

//initialize UI elements
var pane, sys;
var agentId = null, agentType, agentPos;

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
  agents = new AgentList(PARAMS.size,PARAMS.speed,PATHS,playground);
  agents.addAgents(PARAMS.agentCount);

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addMonitor(PARAMS, 'fps',{format: (v) => round(v)});
  sys.addMonitor(PARAMS, 'fps',{view: 'graph'});

  hlAgent = pane.addFolder({title:"Highlight Agent"});
  updateHighlight(0);

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

//updates the Highlight agent panel to highlight the new agent
function updateHighlight(newIndex)  {
  agents.getAgent(agents.hightlightIndex).highlight = false;
  agents.hightlightIndex = newIndex;
  agents.getAgent(newIndex).highlight = true;

  if (agentId != null) {
    agentId.dispose();
    agentType.dispose();
    agentPos.dispose();
  }

  agentId = hlAgent.addMonitor(agents.getHightlight(), 'id',{format: (v) => round(v)});
  agentType = hlAgent.addMonitor(agents.getHightlight(), 'type');
  agentPos = hlAgent.addInput(agents.getHightlight(), "pos", { x: {min: playground.xmin, max: playground.xmax}, y: {min: playground.ymin, max: playground.ymax}});
}



//called when the screen is resized.
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
        updateHighlight(i);
      }
  }
}


