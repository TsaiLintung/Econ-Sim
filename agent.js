class AgentList {
    constructor(size, speed, path, playground){
        this.size = size; 
        this.speed = speed; 
        this.path = path;
        this.list = [];
        this.playground = playground;
        this.hightlightIndex = 0;
    }

    addAgent(pos = null){

        if (pos == null){ pos = {
            x : random(this.playground.xmin, this.playground.xmax),
            y : random(this.playground.ymin, this.playground.ymax)
            };
        };

        this.list.push(new Agent(this.list.length, pos, this.size , this.speed, this.playground, this.path));
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
    constructor(id,pos,size,speed,playground,path){
        this.id = id;
        this.pos = pos;
        this.speed = speed;
        this.direction = random(-PI,PI);
        this.pic = loadImage(path);
        this.size = size;
        this.pic.resize(this.size, 0);
        this.playgound = playground;
        this.hightlight = false;
    }

    update(){
        //move
        this.pos.x += this.speed*cos(this.direction);
        this.pos.y += this.speed*sin(this.direction);

        //handle out of bounds, currently does not sync with the playgound outside
        if (this.pos.x >= this.playgound.xmax){this.direction = PI - this.direction; this.pos.x -= this.speed};
        if (this.pos.x <= this.playgound.xmin){this.direction = PI - this.direction; this.pos.x += this.speed};
        if (this.pos.y >= this.playgound.ymax){this.direction = - this.direction; this.pos.y -= this.speed};
        if (this.pos.y <= this.playgound.ymin){this.direction = - this.direction; this.pos.y += this.speed};

        //make angle stay between PI and -PI
        if (this.direction > PI){ this.direction -= 2*PI;}
        if (this.direction < -PI){ this.direction += 2*PI;}

    }

    draw(){
        push();
        if (this.direction >= PI/2 | this.direction <= -PI/2){

            
            scale(-1,1);

            //the coordinate is also flipped so need to be -this.x
            image(this.pic, -this.pos.x, this.pos.y);

            

        } else {image(this.pic, this.pos.x, this.pos.y); }
        pop();
        
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
    }

    meet(otherAgent){
        //Currently does nothing 
    }
}