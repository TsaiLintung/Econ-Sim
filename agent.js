class AgentList {
    constructor(size, speed, paths, playground){
        this.size = size; 
        this.speed = speed; 
        this.paths = paths;
        this.list = [];
        this.playground = playground;
        this.hightlightIndex = 0;
        this.lastDino = "Y";
    }

    addAgents(count){

        var path, pos
        
        for (var i = 0; i < count; i++){

            pos = {x:random(this.playground.xmin, this.playground.xmax),
                   y:random(this.playground.ymin, this.playground.ymax)};

            if (this.lastDino == "Y"){this.lastDino = "R"; path = this.paths.rdino;} 
            else if (this.lastDino == "R") {this.lastDino = "G"; path = this.paths.gdino;}
            else if (this.lastDino == "G"){this.lastDino = "Y"; path = this.paths.ydino;} 
    
            this.list.push(new Agent(this.list.length, this.lastDino ,pos, this.size , this.speed, this.playground, path));
        }
    }

    push(agent){this.list.push(agent);}

    getAgent(index){return this.list[index];}

    getHightlight(){
        return this.list[this.hightlightIndex];
    }

    draw(){
        for (var i = 0; i < this.list.length; i++){
            this.list[i].draw();
        }
    }

    update(){
        for (var i = 0; i < this.list.length; i++){
            this.list[i].update();
        }
        this.checkCollide()
    }

    checkCollide(){

        //Should implement quad tree or at least grid system to optimize performance
        for (var i = 0; i < this.list.length; i++){
            for (var j = 0; j < this.list.length; j++){
                if( !(i==j) & this.getAgent(i).agentCollide(this.getAgent(j))){
                    this.getAgent(i).meet(this.getAgent(j));
                }
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////

class Agent {
    constructor(id,type,pos,size,speed,playground,path){
        this.id = id;
        this.type = type;
        this.pos = pos;
        this.speed = speed;
        this.direction = random(-PI,PI);
        this.pic = loadImage(path);
        this.utility = 0;
        this.size = size;
        this.playgound = playground;
        this.hightlight = false;

        //somehow the picture functions cannot be called in the constructor.
    }

    update(){
        //move
        this.pos.x += this.speed*cos(this.direction);
        this.pos.y += this.speed*sin(this.direction);

        //handle out of bounds, currently does not sync with the global playgound, so need to reset agents after screen resize
        if (this.pos.x >= this.playgound.xmax){this.direction = PI - this.direction; this.pos.x -= this.speed};
        if (this.pos.x <= this.playgound.xmin){this.direction = PI - this.direction; this.pos.x += this.speed};
        if (this.pos.y >= this.playgound.ymax){this.direction = - this.direction; this.pos.y -= this.speed};
        if (this.pos.y <= this.playgound.ymin){this.direction = - this.direction; this.pos.y += this.speed};

        //make angle stay between PI and -PI
        if (this.direction > PI){ this.direction -= 2*PI;}
        if (this.direction < -PI){ this.direction += 2*PI;}

        this.pic.delay(PARAMS.gifDelay); // call a global parameter here, just too lazy...

        this.utility = this.utility*PARAMS.discount;
    }

    draw(){

        // draw the dino
        push();
            let scaling = this.size/this.pic.width;
            //scale the image, but is kind of dangerous and perhaps slow?
            scale(scaling, scaling);
            if (this.direction >= PI/2 | this.direction <= -PI/2){
                scale(-1,1);

                //the coordinate is also flipped and scaled so need to be -this.x/scaling
                image(this.pic, -this.pos.x/scaling, this.pos.y/scaling);

            } else {image(this.pic, this.pos.x/scaling, this.pos.y/scaling);}
        pop();
        
        // draw the highlight circle
        if(this.highlight){
            noFill();
            stroke(51);
            circle(this.pos.x, this.pos.y, this.size);
        }
    }

    pointCollide(x,y){
        return collidePointCircle(x,y,this.pos.x,this.pos.y,this.size)
    }

    agentCollide(otherAgent){
        return collideCircleCircle(this.pos.x,this.pos.y,this.size, otherAgent.pos.x, otherAgent.pos.y, otherAgent.size)
    }

    copy(agent){
        this.id = agent.id;
        this.pos = agent.pos;
        this.speed = agent.speed;
        this.direction = agent.direction;
        this.pic = agent.pic;
        this.size = agent.size;
        this.playgound = agent.playground;
        this.hightlight = agent.hightlight;
        this.utility = agent.utility;
    }

    meet(otherAgent){
        //Currently does nothing 
    }
}