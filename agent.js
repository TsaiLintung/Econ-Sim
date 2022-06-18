

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
        this.learnCoolDown = 0;
        this.log = [];
        this.supply = PARAMS.initSupply;
        this.demand = PARAMS.initDemand;
        this.logD = "";
        this.haveMoney = false;

        //somehow the picture functions cannot be called in the constructor.
    }

    update(){
        //move
        this.pos.x += this.speed*cos(this.direction)*(1-this.coolDown/PARAMS.coolDown);
        this.pos.y += this.speed*sin(this.direction)*(1-this.coolDown/PARAMS.coolDown);

        //handle out of bounds, currently does not sync with the global playgound, so need to reset agents after screen resize
        if (this.pos.x >= PLAYGROUND.xmax){this.direction = PI - this.direction; this.pos.x -= this.speed};
        if (this.pos.x <= PLAYGROUND.xmin){this.direction = PI - this.direction; this.pos.x += this.speed};
        if (this.pos.y >= PLAYGROUND.ymax){this.direction = - this.direction; this.pos.y -= this.speed};
        if (this.pos.y <= PLAYGROUND.ymin){this.direction = - this.direction; this.pos.y += this.speed};

        //make angle stay between PI and -PI
        if (this.direction > PI){ this.direction -= 2*PI;}
        if (this.direction < -PI){ this.direction += 2*PI;}

        this.pic.delay(PARAMS.gifDelay); //set the delay for the gif

        // manage log
        while (this.log.length > PARAMS.logLength){
            this.log.shift();
        }
        this.logD = "";
        for (let i = 0; i < this.log.length; i++){
            this.logD += this.log[i] + "\n";
        }

        //discount and cd
        this.utility = this.utility*PARAMS.discount;
        this.coolDown = max(0, this.coolDown - 1);
        this.learnCoolDown = max(0, this.learnCoolDown - 1);

        //mutate in a very small chance
        if (Math.random()<PARAMS.mutateRate){this.mutate()}
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

        if (this.haveMoney){image(moneyPic, this.pos.x, this.pos.y - this.size/1.7);}
        
    }

    pointCollide(x,y){
        return collidePointCircle(x,y,this.pos.x,this.pos.y,this.size)
    }

    agentCollide(otherAgent){
        return collideCircleCircle(this.pos.x,this.pos.y,this.size, otherAgent.pos.x, otherAgent.pos.y, otherAgent.size)
    }

    meet(otherAgent){
        if (this.coolDown == 0 & otherAgent.coolDown == 0 & otherAgent.type == this.want()){
            this.trade(otherAgent);
        }

        if (this.learnCoolDown == 0 & otherAgent.learnCoolDown == 0){
            // learn from others if they are doing well, symmetric so don't consider if I'm doing better.
            if (otherAgent.type == this.type){
                if (this.utility < otherAgent.utility){
                    if (Math.random()>0.5){
                        let Olddemand = this.demand;
                        this.demand = this.demand*(1-PARAMS.learnRate)+otherAgent.demand*PARAMS.learnRate;
                        if (this.demand > Olddemand){this.log.push("Learn " + otherAgent.type + otherAgent.id + ", demand up.");}
                        else {this.log.push("Learn " + otherAgent.type + otherAgent.id + ", demand down.");}
                    } else {
                        let Oldsupply = this.supply;
                        this.supply = this.supply*(1-PARAMS.learnRate)+otherAgent.supply*PARAMS.learnRate;
                        if (this.supply > Oldsupply){this.log.push("Learn " + otherAgent.type + otherAgent.id + " supply up.");}
                        else {this.log.push("Learn " + otherAgent.type + otherAgent.id + ", supply down.");}
                    }
                    this.learnCoolDown = PARAMS.coolDown; //cool down for learning
                    otherAgent.learnCoolDown = PARAMS.coolDown;
                }
            }
        }
    }

    mutate(){
        if (Math.random()<0.5){
            let oldSupply = this.supply; 
            this.supply *= 1+randn_bm(-PARAMS.mutateRatio, PARAMS.mutateRatio,1);
            this.supply = max(0,this.supply);
            if (this.supply > oldSupply){this.log.push("Mutate supply up.");}
            else if (this.supply < oldSupply){this.log.push("Mutate supply down.");}
        }else{
            let oldDemand = this.demand; 
            this.demand *= 1+randn_bm(-PARAMS.mutateRatio, PARAMS.mutateRatio,1);
            this.demand = max(0,this.demand);
            if (this.demand > oldDemand){this.log.push("Mutate demand up.");}
            else{this.log.push("Mutate demand down.");}
        }
    }

    trade(otherAgent){
        if (this.haveMoney == true & otherAgent.haveMoney == false){
            if (this.demand <= otherAgent.supply){
                this.utility += consumptionGain(this.demand);
                otherAgent.utility += productionCost(this.demand);

                this.haveMoney = false;
                otherAgent.haveMoney = true;

                this.log.push("Trade " + otherAgent.type + otherAgent.id + ", eat " + round(this.demand*100)/100 +".");
                otherAgent.log.push("Trade " + this.type + this.id + ", give " + round(this.demand*100)/100 +".");

                this.coolDown = PARAMS.coolDown;
                otherAgent.coolDown = PARAMS.coolDown;

                //turn direction
                this.direction = random(-PI,PI);
                otherAgent.direction = PI - this.direction; // turn the other agent to face the opposite direction
            } else {
                this.log.push("Rejected by " + otherAgent.type + otherAgent.id + "'s "+ round(otherAgent.supply*100)/100 +".");
                otherAgent.log.push("Reject " + this.type + this.id + "'s "+ round(this.demand*100)/100 + "."); 
                this.coolDown = PARAMS.coolDown/3; // little cooldown 
                otherAgent.coolDown = PARAMS.coolDown/3;
            }
        }
    }

    want(){ // Y want R's service, R want G's service, G want Y's service.
        if (this.type == "Y"){return "R";}
        else if (this.type == "R"){return "G";}
        else if (this.type == "G"){return "Y";}
    }
}