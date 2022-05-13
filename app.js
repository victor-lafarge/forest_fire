const tileSize = 40

document.addEventListener('DOMContentLoaded', ()=> {



    let canvas =  document.querySelector("#forest-fire-canvas")
    let ctx = canvas.getContext('2d');
    let inputHeight = document.querySelector('#canvas-height')
    let height = inputHeight.value
    let inputWidth = document.querySelector('#canvas-width')
    let width = inputWidth.value

    inputHeight.addEventListener('change', ()=>{
        height = inputHeight.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('clear');
        displayTrees()
    })
    inputWidth.addEventListener('change', ()=>{
        width = inputWidth.value
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('clear');
        displayTrees()
    })


    
    initCanvas(canvas)
    window.addEventListener('resize', initCanvas)
    let trees


        
    displayTrees(canvas, ctx)
    

    function displayTrees()
    {
        trees = []
        console.log(trees)
        for(let x = 0; x < width; x++ ) {
            trees.push([])
            for(let y = 0; y < height; y++ ) {
                trees[x].push(0)
                displayTree(x, y)
            }
        }
        let burnX = getRandomInt(0, width)
        let burnY =  getRandomInt(0, height)
        setTimeout(()=>displayTree(burnX, burnY, 1), 500)
        
    }

    function initCanvas() {
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function displayTree(x, y, burn = 0) {
        ctx.beginPath();
        ctx.arc(((x+0.5)/width)*canvas.width, ((y+0.5)/height)*canvas.height, 10, 0, Math.PI*2);
        ctx.fillStyle = burn == 1 ? 'red' : 'green'
        ctx.fill();
        ctx.closePath();
    }
})

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min +1));
}

