

class Agent {
    constructor(id,type,pos,size,speed,path){
        this.id = id;
        this.type = type;
        this.pos = pos;
        this.speed = speed;
        this.direction = random(-PI,PI);
        this.pic = loadImage(path);
        this.utility = 0;
        this.size = size;
        this.coolDown = 0;
        this.log = [];
        this.supply = 1;
        this.demand = 0.9;
        this.logD = "";

        //somehow the picture functions cannot be called in the constructor.
    }

    update(){
        //move
        this.pos.x += this.speed*cos(this.direction);
        this.pos.y += this.speed*sin(this.direction);

        //handle out of bounds, currently does not sync with the global playgound, so need to reset agents after screen resize
        if (this.pos.x >= PLAYGROUND.xmax){this.direction = PI - this.direction; this.pos.x -= this.speed};
        if (this.pos.x <= PLAYGROUND.xmin){this.direction = PI - this.direction; this.pos.x += this.speed};
        if (this.pos.y >= PLAYGROUND.ymax){this.direction = - this.direction; this.pos.y -= this.speed};
        if (this.pos.y <= PLAYGROUND.ymin){this.direction = - this.direction; this.pos.y += this.speed};

        //make angle stay between PI and -PI
        if (this.direction > PI){ this.direction -= 2*PI;}
        if (this.direction < -PI){ this.direction += 2*PI;}

        this.pic.delay(PARAMS.gifDelay); //set the delay for the gif

        this.utility = this.utility*PARAMS.discount;
        this.coolDown = max(0, this.coolDown - 1);

        while (this.log.length > PARAMS.logLength){
            this.log.shift();
        }

        this.logD = "";
        for (let i = 0; i < this.log.length; i++){
            this.logD += this.log[i] + "\n";
        }
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
        
    }

    pointCollide(x,y){
        return collidePointCircle(x,y,this.pos.x,this.pos.y,this.size)
    }

    agentCollide(otherAgent){
        return collideCircleCircle(this.pos.x,this.pos.y,this.size, otherAgent.pos.x, otherAgent.pos.y, otherAgent.size)
    }

    meet(otherAgent){
        if (this.coolDown == 0 & otherAgent.coolDown == 0){
            if (otherAgent.type == this.want()){
                if (this.demand <= otherAgent.supply){
                    this.utility += consumptionGain(this.demand);
                    otherAgent.utility += productionCost(this.demand);
                    this.log.push("Meet " + otherAgent.type + otherAgent.id + ", eat " + this.demand +".");
                    otherAgent.log.push("Meet " + this.type + this.id + ", give " + this.demand +".");
                }
            }

            this.coolDown = PARAMS.coolDown;
            otherAgent.coolDown = PARAMS.coolDown;
        }
    }

    want(){ // Y want R's service, R want G's service, G want Y's service.
        if (this.type == "Y"){return "R";}
        else if (this.type == "R"){return "G";}
        else if (this.type == "G"){return "Y";}
    }
}