
//setup the economc parameters
econ_param = {
  "agent_count": 60,
  "fruit_count": 6,
  "want_mean": 1,
  "want_sd": 0.5,
  "produce_mean": 1,
  "produce_sd": 0.5,
  "discount": 0.9999,
  "evolve_intensity": 3,
  "evolve_interval": 2
};

// setup the system parameters
let windowHeight, windowWidth;
let fps = 60,
fontSize = 50,
cpation = "Econ Sim",
maxLogs = 15,
bgColor = "#FFFFF0";

let x = 0;

//setup the paths for assets
dinoPath = 'assets/graphics/player/animation/dino-0.png'
let dinoPic;


//this is called when the sim started.
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fps);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth; 
  dinoPic = loadImage(dinoPath);
}

//this is called every frame
function draw() {
  background(bgColor);
  if(mouseIsPressed){fill(255);}
  else{fill(0);}
  ellipse(mouseX,mouseY,80,80);
  image(dinoPic, x, windowHeight/2);
  x += 5;
  if (x >= windowWidth){x=0;}
  frameRate(fps);
}

//this is called when the screen is resized.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;  
}

