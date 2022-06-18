class AgentList {
    constructor(size, speed, paths){
        this.size = size; 
        this.speed = speed; 
        this.paths = paths;
        this.list = [];
        this.hightlightIndex = 0;
        this.lastDino = "Y";
        this.stats = {
            mUtility:0,
            mDemand:0,
            mSupply:0
        };
    }

    addAgents(count){

        var path, pos
        
        for (var i = 0; i < count; i++){

            pos = {x:random(PLAYGROUND.xmin, PLAYGROUND.xmax),
                   y:random(PLAYGROUND.ymin, PLAYGROUND.ymax)};

            if (this.lastDino == "Y"){this.lastDino = "R"; path = this.paths.rdino;} 
            else if (this.lastDino == "R") {this.lastDino = "G"; path = this.paths.gdino;}
            else if (this.lastDino == "G"){this.lastDino = "Y"; path = this.paths.ydino;} 
    
            this.list.push(new Agent(this.list.length, this.lastDino ,pos, this.size , this.speed, path));
        }
    }

    push(agent){this.list.push(agent);}

    getAgent(index){return this.list[index];}

    getHighlight(){
        return this.list[this.hightlightIndex];
    }

    draw(){
        for (var i = 0; i < this.list.length; i++){
            this.list[i].draw();
        }

        // draw the highlight circle
        noFill();
        stroke(51);
        circle(this.getHighlight().pos.x, this.getHighlight().pos.y, this.getHighlight().size);
        
    }

    //updates the Highlight agent panel to highlight the new agent
    updateHighlight(newIndex) {
        if (OPTIONS.id > this.list.length){OPTIONS.id = this.hightlightIndex; return;}

        if (this.hightlightIndex != OPTIONS.id){
        this.hightlightIndex = newIndex;
    
        if (agentId != null) {
            agentId.dispose();
            agentType.dispose();
            agentPos.dispose();
            agentLog.dispose();
            agentUtility.dispose();
            agentDemand.dispose();
            agentSupply.dispose();
        }
    
        agentId = hlAgent.addInput(OPTIONS, 'id',{format: (v) => round(v)});
        agentType = hlAgent.addMonitor(this.getHighlight(), 'type');
        agentPos = hlAgent.addInput(this.getHighlight(), "pos", { x: {min: PLAYGROUND.xmin, max: PLAYGROUND.xmax}, y: {min: PLAYGROUND.ymin, max: PLAYGROUND.ymax}});
        agentDemand = hlAgent.addMonitor(this.getHighlight(), 'demand',{format: (v) => round(v,2)});
        agentSupply = hlAgent.addMonitor(this.getHighlight(), 'supply', {format: (v) => round(v,2)});
        agentUtility = hlAgent.addMonitor(this.getHighlight(), 'utility',{format: (v) => round(v,2)});
        agentLog = hlAgent.addMonitor(this.getHighlight(), 'logD', {multiline:true, lineCount: PARAMS.logLength});

        }
    }

    updateStat(){
        this.stats.mUtility = 0;
        this.stats.mDemand = 0;
        this.stats.mSupply = 0;

        for (var i = 0; i < this.list.length; i++){
            this.stats.mUtility += this.list[i].utility;
            this.stats.mDemand += this.list[i].demand;
            this.stats.mSupply += this.list[i].supply;
        }

        this.stats.mUtility /= this.list.length;
        this.stats.mDemand /= this.list.length;
        this.stats.mSupply /= this.list.length;
    }

    update(){
        for (var i = 0; i < this.list.length; i++){
            this.list[i].update();
        }
        this.checkCollide()

       
        this.updateHighlight(OPTIONS.id); // this function is currently in global scope.
        this.updateStat();
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

    giveMoney(step){
        for (var i = 0; i < this.list.length; i++){
            if (i % step == 0){this.list[i].haveMoney = true;}
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////