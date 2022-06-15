
//setup the economc parameters
var PARAMS = {
  speed: 2,
  size: 40,
  target_fps:60,
  fps:0,
  bgColor: "#FFFFF0",
  agentCount: 10,
};

// setup the system parameters
let windowHeight, windowWidth;

//setup the paths for assets
const PATHS = {
  dino:"assets/graphics/player/gdino-walk.gif"
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
  agents = new AgentList(PARAMS.size,PARAMS.speed,PATHS.dino,playground);

  for (i = 0; i <PARAMS.agentCount; i++) {agents.addAgent();}

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addMonitor(PARAMS, 'fps',{format: (v) => round(v)});
  sys.addMonitor(PARAMS, 'fps',{view: 'graph'});

  highlightAgent = new Agent(null, null, 1, null, null, PATHS.dino);
  highlightAgent.copy(agents.getHightlight());
  agents.getAgent(0).highlight = true;

  focusAgent = pane.addFolder({title:"Focus Agent"});
  focusAgent.addMonitor(highlightAgent, 'id',{format: (v) => round(v)});
  focusAgent.addMonitor(highlightAgent.pos, 'x');
  focusAgent.addMonitor(highlightAgent.pos, 'y');
}

//this is called every frame
function draw() {
  background(PARAMS.bgColor);

  agents.update();
  agents.draw();


  //update hightlight agent
  highlightAgent.copy(agents.getHightlight());
  
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
      }
  }

}


