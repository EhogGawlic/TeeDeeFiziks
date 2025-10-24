import { Game } from "./engine.js";

async function main() {
    const game = new Game("glcanvas")
    await game.init("glcanvas",()=>{
        game.addBox(0,0,0,1,1,1,game.things,"Part")
    })
    //game.addBox(0,0,0,1,1,1,game.things,"Part")
}
main().catch((reason)=>{alert(reason)})