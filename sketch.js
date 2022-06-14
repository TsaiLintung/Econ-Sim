function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  if(mouseIsPressed){pressed();}
  else{notpressed();}
  ellipse(mouseX,mouseY,80,80);
}