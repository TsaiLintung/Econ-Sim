class Agent {
    constructor(x,y,speed,path){
        this.pos = {x:x, y:y}
        this.speed = speed;
        this.direction = 0;
        this.pic = loadImage(path);
    }

    update(){
        this.pos.x += this.speed*cos(this.direction);
        this.pos.y += this.speed*sin(this.direction);
        if (this.pos.x >= windowWidth){this.pos.x=0;}
    }
}