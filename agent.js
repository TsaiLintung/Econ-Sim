

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
        this.trade(otherAgent);
        this.learn(otherAgent);
    }

    trade(otherAgent){
        if (otherAgent.coolDown > 0 | this.coolDown > 0){return} //can't trade if one is cooling down.
        if (otherAgent.type != this.want()){return;}
        if (!this.haveMoney){return;}
        if (otherAgent.haveMoney){return;}

        let offer = this.demand; // make the offer according to own demand

        if (otherAgent.acceptOffer(this, offer)){

            //get corresponding utility
            this.utility += consumptionGain(offer);
            otherAgent.utility += productionCost(offer);

            //exchange money
            this.haveMoney = false;
            otherAgent.haveMoney = true;

            //log the trade
            this.log.push("Trade " + otherAgent.type + otherAgent.id + ", eat " + round(offer*100)/100 +".");
    
            // cooldown to avoid trade spam
            this.coolDown = PARAMS.coolDown;
            
        } else {
            this.log.push("Rejected by " + otherAgent.type + otherAgent.id + "'s "+ round(otherAgent.supply*100)/100 +".");
            this.coolDown = PARAMS.coolDown/6; // little cooldown for rejection
        }

        //turn direction to avoid multiple collision
        this.direction = random(-PI,PI);
    }

    want(){ // Y want R's service, R want G's service, G want Y's service.

        if (this.type == "Y"){return "R";}
        else if (this.type == "R"){return "G";}
        else if (this.type == "G"){return "Y";}
    }

    acceptOffer(offerAgent, offer){
        if (this.supply >= offer){ //accept the offer if it is lower than own supply
            this.log.push("Trade " + offerAgent.type + offerAgent.id + ", give " + round(offer*100)/100 +".");
            this.direction = random(-PI,PI);
            this.coolDown = PARAMS.coolDown;
            return true;
        }
        else {
            this.log.push("Reject " + offerAgent.type + offerAgent.id + "'s "+ round(offer*100)/100 + "."); 
            this.direction = random(-PI,PI);
            this.coolDown = PARAMS.coolDown/6;
            return false;
        }
    }

    learn(otherAgent){
        if (this.learnCoolDown > 0 | otherAgent.learnCoolDown > 0){return} //can't learn if one is cooling down.
        if (otherAgent.type != this.type){return} //can't learn if they are different types
        if (otherAgent.utility < this.utility){return} //can't learn if the other agent is not doing well

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