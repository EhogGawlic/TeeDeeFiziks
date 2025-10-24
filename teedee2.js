import { Game } from "./engine.js";

async function main() {
    const game = new Game("glcanvas")
    await game.init("glcanvas",()=>{
        const box1 = game.addBox(0,0,0,1,1,1,game.things,"Part",{r:1,g:0.5,b:1})
        game.addBox(0,-2,0,100,1,100,game.things,"Part2", {r:0.5,g:0.25,b:0})
        game.addBall(0,3,0,1,game.things,"bol",{r:0,g:1,b:0.5})
        
    })
}
main().catch((reason)=>{alert(reason)})