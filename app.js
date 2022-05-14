const tileSize = 40
const COLORS = ['green', 'red', 'gray']


document.addEventListener('DOMContentLoaded', ()=> {



    let canvas =  document.querySelector("#forest-fire-canvas")
    let ctx = canvas.getContext('2d');
    let inputHeight = document.querySelector('#canvas-height')
    let height = inputHeight.value
    let inputWidth = document.querySelector('#canvas-width')
    let width = inputWidth.value

    let atLeastOneOnFire = true

    initCanvas(canvas)
    window.addEventListener('resize', initCanvas)

    let trees = initTreesArray(width, height)
    displayTrees(canvas, ctx, trees)

    inputHeight.addEventListener('change', ()=>{
        height = inputHeight.value;
        trees = initTreesArray(width, height)

        displayTrees(canvas, ctx, trees)
        
    })
    inputWidth.addEventListener('change', ()=>{
        width = inputWidth.value
        trees = initTreesArray(width, height)

        displayTrees(canvas, ctx, trees)
    })


    canvas.addEventListener('click', (evt)=> {
    	let mousePos = getMousePos(evt, canvas);
        let listPos = getListPosition(mousePos, trees, canvas)
        trees[listPos.x][listPos.y] = 1
        displayTrees(canvas, ctx, trees)
        atLeastOneOnFire = true
		console.log("list X : " + listPos.x, "list Y : " + listPos.y);
    })
    

    let probaInput = document.querySelector('#proba-fire-input')
    
    document.querySelector('#next-btn').addEventListener('click', ()=>{
        [ trees, atLeastOneOnFire] = oneStep(trees, probaInput.value)
        console.log(atLeastOneOnFire)
        displayTrees(canvas, ctx, trees)
    })

    let frameSpeedMs = 500
    let interval

    document.querySelector('#go-to-end-btn').addEventListener('click', ()=>{
        interval = setNewInterval()
    })

    document.querySelector('#restart-btn').addEventListener('click', () =>{
        trees = initTreesArray(width, height)
        displayTrees(canvas, ctx, trees)
        atLeastOneOnFire = true
        clearInterval(interval)
        interval = null
    })

    let speedInput = document.querySelector('#frame-speed')
    speedInput.addEventListener('change', ()=>{
        frameSpeedMs = (100-speedInput.value) *10
        if(interval) {
            interval = setNewInterval()
        }
    })

    function setNewInterval() {
        clearInterval(interval)
        return setInterval(()=>{
            [ trees, atLeastOneOnFire] = oneStep(trees, probaInput.value)
            displayTrees(canvas, ctx, trees)
            console.log('end');
            if(!atLeastOneOnFire) {
                clearInterval(interval);
                interval = null
            }
        }, frameSpeedMs)
    }
    

   
})

function initCanvas(canvas) {
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function initTreesArray(width, height, withBurningTree = true) {
    let trees = []
    
    for(let x = 0; x < width; x++ ) {
        trees.push([])
        for(let y = 0; y < height; y++ ) {
            trees[x].push(0)
        }
    }
    if(withBurningTree) 
        trees[getRandomInt(0, width)][getRandomInt(0, height)] = 1

    return trees
    
}

function displayTrees(canvas, ctx, trees) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let radius = Math.min(canvas.width/(trees.length*2), canvas.width/(trees[0].length*2))
    for(let x in trees) {
        x= parseInt(x)
        for (let y in trees[x]) {
            y = parseInt(y)

            ctx.beginPath();
            ctx.arc(((x+0.5)/trees.length)*canvas.width, ((y+0.5)/trees[x].length)*canvas.height, radius, 0, Math.PI*2);
            ctx.fillStyle = COLORS[trees[x][y]]
            ctx.fill();
            ctx.closePath();
        }
    }
}

function oneStep(trees, proba) {
    let newTrees = initTreesArray(trees.length, trees[0].length, false)
    let atLeastOneOnFire = false
    for(let x in trees) {
        x= parseInt(x)
        for (let y in trees[x]) {
            y = parseInt(y)
            if(newTrees[x][y] == 0)
            {
                newTrees[x][y] = trees[x][y]
                if(trees[x][y] == 1) {
                    newTrees[x][y] = 2
                    for(let neighbor of getNeighbors(x, y)) {
                        let x2 = neighbor[0]
                        let y2 = neighbor[1]
                        if(x2 >= 0 && y2 >= 0 && x2 < trees.length && y2 < trees[0].length) {
                            if(trees[x2][y2] == 0) {
                                let fire = onFire(proba)
                                newTrees[x2][y2] = fire
                                if(fire == 1) 
                                    atLeastOneOnFire = true
                            }
                        }
                    }
                }
            }
        }
    }

    return [newTrees, atLeastOneOnFire]
}

function getListPosition(mousePos, trees, canvas) {
    return {
        x: Math.floor((mousePos.x/canvas.width)*trees.length),
        y: Math.floor((mousePos.y/canvas.height)*trees[0].length),
    }
}

function getMousePos(evt, canvas) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getNeighbors(x, y) {
    return [[x-1, y], [x+1, y], [x, y-1], [x, y+1]]
}

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function onFire(proba) {
    return Math.random() < proba ? 1 : 0
}

