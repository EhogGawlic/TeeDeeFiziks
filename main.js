import { Game } from "./teedee/engine.js";
//import { add } from "./teedee/toji-gl-matrix-1f872b8/src/mat4.js";

let loaded = false
async function main() {
    const game = new Game("glcanvas")
    await game.init("glcanvas",()=>{
        game.addBox(0,-2,0,25,1,25,game.things,"Part2", {r:0.5,g:0.75,b:0})
        loaded = true
    })
    let partn = 0
    addEventListener('keydown',(e)=>{
        switch(e.key){
            case 'a':
                if(loaded){
                    partn += 1
                    const ball = game.addBall(Math.random()-0.5,10,Math.random()-0.5,1,game.things,"Ball"+partn,{r:1,g:0,b:0})
                    ball.anchored=false
                }
        }
    })
    addEventListener('click', (e)=>{
        //raytrace somehow
        if(loaded){
            Game.raytrace(e.clientX,e.clientY,glcanvas).then((pos)=>{
                alert(pos)
            })
        }
    })
}
main().catch((reason)=>{alert(reason)})