const COLORS = ['green', 'red', 'gray']

document.addEventListener('DOMContentLoaded', ()=> {


    let canvas =  document.querySelector("#forest-fire-canvas")
    let inputHeight = document.querySelector('#canvas-height')
    let inputWidth = document.querySelector('#canvas-width')
    let propagationProbabilityInput = document.querySelector('#proba-fire-input')
    let speedInput = document.querySelector('#frame-speed')


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

    //restart everything
    document.querySelector('#clear-btn').addEventListener('click', () =>{
        playGround.initDisplayTrees()
    })

    //spped change speed between steps
    speedInput.addEventListener('change', ()=>{
        playGround.setFrameSpeed(speedInput.value)
    })

    let windActivate = document.querySelector('#wind-is-activate-input')
    windActivate.addEventListener('input', ()=> {
        document.querySelector('#arrow-wind-direction').classList.toggle('d-none')
        if(windActivate.checked) {

            playGround.windVector.x = Math.cos((windDirectionInput.value * Math.PI*2)/100)/2
            playGround.windVector.y = Math.sin((windDirectionInput.value * Math.PI*2)/100)/2
        } else {
            playGround.windVector.x = 0
            playGround.windVector.y = 0
        } 
 
        console.log(playGround.windVector)
    })

    let windDirectionInput = document.querySelector('#wind-direction-input')
    document.querySelector('#arrow-wind-direction').style.transform = 'rotate(180deg)'
    windDirectionInput.addEventListener('input', ()=> {
        document.querySelector('#arrow-wind-direction').style.transform = 'rotate('+(windDirectionInput.value*3.6+180)+'deg)'
        if(windActivate.checked) {

            playGround.windVector.x = Math.cos((windDirectionInput.value * Math.PI*2)/100)/2
            playGround.windVector.y = Math.sin((windDirectionInput.value * Math.PI*2)/100)/2
        }
    })

    


})


