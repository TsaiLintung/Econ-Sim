
//setup the economc parameters
const PARAMS = {
  speed: 5,
  size: 40,
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
  imageMode(CENTER);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 


  //Initialize agents
  agents = new AgentList(PARAMS.size,PARAMS.speed,PATHS.dino,playground);

  for (i = 0; i <PARAMS.agentCount; i++) {agents.addAgent();}

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addInput(PARAMS, 'fps', {min :30, max : 120});

  highlightAgent = new Agent(null, null, 1, null, null, PATHS.dino);
  highlightAgent.copy(agents.getHightlight());
  agents.getAgent(0).highlight = true;

  focusAgent = pane.addFolder({title:"Focus Agent"});
  focusAgent.addMonitor(highlightAgent, 'id');
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
  

  frameRate(PARAMS.fps);
  pane.refresh();
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}


//this is called when the mouse is clicked
function mouseClicked(){

  //if clicked on an agent, switch the highlight
  for (var i = 0; i < agents.list.length; i++) {
      if (agents.list[i].pointCollide(mouseX, mouseY)){
        agents.getAgent(agents.hightlightIndex).highlight = false;
        agents.hightlightIndex = i;
        agents.getAgent(i).highlight = true;
      }
  }

}


