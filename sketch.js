
//setup the parameters
var PARAMS = {
  speed: 5,
  size: 100,
  gifDelay:150,
  target_fps:60,
  fps:0,
  bgColor: "#FFFFF0",
  logLength: 10,
  /////////// ECONOMIC PARAMETERS ///////////
  agentCount: 100, // my computer can run at 60fps with around 120 agents.
  discount: 0.9998,
  coolDown: 120, // Cooldown for meeting is 90 frame
  initDemand: 10,
  initSupply: 10,
  mutateRate:0.0005,
  mutateRatio: 1,
  learnRate: 0.2
};
let windowHeight, windowWidth;

var OPTIONS ={
  id: 1 // the highlighed agent's id. 
}

//setup the paths for assets
const PATHS = {
  gdino:"assets/graphics/player/gdino-walk.gif",
  rdino:"assets/graphics/player/rdino-walk.gif",
  ydino:"assets/graphics/player/ydino-walk.gif",
  money:"assets/graphics/coin.png"
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
var agentId = null, agentType, agentUtility ,agentPos, agentLog,hlAgent,agentDemand, agentSupply;
var moneyPic;
var stats;

//define the production and utility functions
function consumptionGain(quantity){return 10*Math.log(quantity)}
function productionCost(quantity){return quantity}

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
  agents.giveMoney(2); // give 1/2 agents money

  pane = new Tweakpane.Pane();
  sys = pane.addFolder({title:"System"});
  sys.addMonitor(PARAMS, 'fps',{format: (v) => round(v)});
  sys.addMonitor(PARAMS, 'fps',{view: 'graph'});

  stats = pane.addFolder({title:"Statistics"});
  stats.addMonitor(agents.stats, 'mUtility');
  stats.addMonitor(agents.stats, 'mDemand');
  stats.addMonitor(agents.stats, 'mSupply');

  hlAgent = pane.addFolder({title:"Highlight Agent"});
  agents.updateHighlight(OPTIONS.id);

  //load image for money
  moneyPic = loadImage(PATHS.money);
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

// function for normal distribution, from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}


