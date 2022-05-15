const COLORS = ['green', 'red', 'gray']

class Tree {
    x
    y
    burn = 0
    neighbors = []

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

document.addEventListener('DOMContentLoaded', ()=> {


    let canvas =  document.querySelector("#forest-fire-canvas")
    let inputHeight = document.querySelector('#canvas-height')
    let inputWidth = document.querySelector('#canvas-width')
    let propagationProbabilityInput = document.querySelector('#proba-fire-input')


    let playGround = new PlayGroud(canvas, inputHeight.value, inputWidth.value, propagationProbabilityInput.value)

    console.log(playGround)
    window.addEventListener('resize', playGround.initCanvas)


    inputHeight.addEventListener('change', ()=>{
        
        playGround.setHeight(inputHeight.value)
    })


    propagationProbabilityInput.addEventListener('change', ()=>{
        playGround.propagationProbability = propagationProbabilityInput.value
    })

    inputWidth.addEventListener('change', ()=>{
        playGround.setWidth(inputWidth.value)
    })

    //Adding or suppress trees in fire
    canvas.addEventListener('click', (evt)=> {
    	playGround.toggleBurningTree(evt)
    })    

    //One step of fire
    document.querySelector('#next-btn').addEventListener('click', ()=>{
        playGround.oneStep();
    })

    
    document.querySelector('#go-to-end-btn').addEventListener('click', ()=>{
        playGround.setNewInterval()
    })


    //restart everything
    document.querySelector('#restart-btn').addEventListener('click', () =>{
        playGround.restart()
    })

    //spped change speed between steps
    let speedInput = document.querySelector('#frame-speed')
    playGround.setFrameSpeed(speedInput.value)
    speedInput.addEventListener('change', ()=>{
        playGround.setFrameSpeed(speedInput.value)
    })
})


