class PlayGroud {

    canvas
    ctx

    trees
    burningTrees = []

    width
    height

    radius

    propagationProbability

    goToTheEndInterval = null
    frameSpeedMs

    constructor(canvas, width, height, propagationProbability) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');

        this.width = width
        this.height = height

        this.propagationProbability = propagationProbability

        this.initCanvas()
        this.restart()
        
    }

    restart() {
        this.burningTrees = []
        this.initTreesArray()
        this.initDisplayTrees()
        if(this.goToTheEndInterval) {
            clearInterval(this.goToTheEndInterval)
            this.goToTheEndInterval = null
        }
    }

    setFrameSpeed(speedInputValue) {
        this.frameSpeedMs = (100-speedInputValue) *10
        if(this.goToTheEndInterval) {
            this.setNewInterval()
        }
    }

    setNewInterval() {
        clearInterval(this.goToTheEndInterval)
        this.goToTheEndInterval = setInterval(()=>{
            this.oneStep()
            if(this.burningTrees.length == 0) {
                clearInterval(this.goToTheEndInterval);
                this.goToTheEndInterval = null
            }
        }, this.frameSpeedMs)
    }

    //-------------------------------------------------------------------------------------------
    // function to set the good format to the canvas
    //-------------------------------------------------------------------------------------------
    initCanvas() {
        // ...then set the internal size to match
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }


    //-------------------------------------------------------------------------------------------
    // function to init the trees array with zeros
    //-------------------------------------------------------------------------------------------
    initTreesArray() {
        this.trees = []
        
        for(let x = 0; x < this.width; x++ ) {
            for(let y = 0; y < this.height; y++ ) {
                this.trees.push(new Tree(x, y))
            }
        }
        this.setNeighbors()
    }

    setNeighbors() {
        for(let tree of this.trees) {
            for(let tree2 of this.trees) {
                if(tree != tree2) {
                    if(Math.abs(tree.x - tree2.x) + Math.abs(tree.y - tree2.y) <= 1)
                    tree.neighbors.push(tree2)
                }
            }
        }
    }

    
    //-------------------------------------------------------------------------------------------
    // function to display all the trees
    //-------------------------------------------------------------------------------------------
    initDisplayTrees() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.radius = Math.min(this.canvas.width/(this.width*2), this.canvas.width/(this.height*2))

        for(let tree of this.trees) {
            this.displayTree(tree)
        }
    }

    displayTree(tree) {
        this.ctx.beginPath();
        this.ctx.arc(((tree.x+0.5)/this.width)*this.canvas.width, ((tree.y+0.5)/this.height)*this.canvas.height, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = COLORS[tree.burn]
        this.ctx.fill();
        this.ctx.closePath();
    }

    setHeight(height) {
        this.height = height;

        this.initTreesArray()
        this.initDisplayTrees()
    }

    setWidth(width) {
        this.width = width;

        this.initTreesArray()
        this.initDisplayTrees()
    }

    toggleBurningTree(evt) {

        let position = this.getTreePositionFromPixelsPosition(this.getMousePos(evt))
        let tree = this.trees.find(tree => tree.x == position.x && tree.y == position.y)
        if(tree.burn == 0) {
            tree.burn = 1
            this.burningTrees.push(tree)

        } else {
            tree.burn = 0
            this.burningTrees.splice(this.burningTrees.indexOf(tree), 1)
        }
        this.displayTree(tree)

    }

    //-------------------------------------------------------------------------------------------
    // function to get the list of tree relative index position from the mouse position on the canvas
    //-------------------------------------------------------------------------------------------
    getTreePositionFromPixelsPosition(mousePos) {
        return {
            x: Math.floor((mousePos.x/this.canvas.width)*this.width),
            y: Math.floor((mousePos.y/this.canvas.height)*this.height),
        }
    }


    //-------------------------------------------------------------------------------------------
    // function to get the relative canvas position in pixels
    //-------------------------------------------------------------------------------------------
    getMousePos(evt) {
        let rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    changeBurningTrees(burningTrees) {
        this.burningTrees = burningTrees
        this.burningTrees.forEach((burningTree) => {
            this.displayTree(burningTree)
        })
    }

    oneStep() {
        let waitingBurningTrees = []
        for(let tree of this.burningTrees) {
            for(let neighbor of tree.neighbors) {
                    if(neighbor.burn == 0) {

                        let burn = this.onFire()
                        if(burn == 1) {
                            neighbor.burn = burn
                            waitingBurningTrees.push(neighbor)
                        }
                    }
            }
            tree.burn = 2
            this.displayTree(tree)
        }
        this.changeBurningTrees(waitingBurningTrees)
    }

    //-------------------------------------------------------------------------------------------
    //function to return randomly if a tree in on fire
    //-------------------------------------------------------------------------------------------
    onFire() {
        return Math.random() < this.propagationProbability ? 1 : 0
    }

}