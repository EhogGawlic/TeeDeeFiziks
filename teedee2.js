import { Game } from "./engine.js";

async function main() {
    const game = new Game("glcanvas")
    await game.init("glcanvas",()=>{
        //const box1 = game.addBox(0,0,0,1,1,1,game.things,"Part",{r:1,g:0.5,b:1})
        game.addBox(0,-2,0,100,1,100,game.things,"Part2", {r:0.5,g:0.25,b:0})
        game.addBox(10,-2,0,1,100,100,game.things,"Part3", {r:0.5,g:0.25,b:0})
        game.addBox(-10,-2,0,1,100,100,game.things,"Part4", {r:0.5,g:0.25,b:0})
        game.addBox(0,-2,-10,100,100,1,game.things,"Part5", {r:0.5,g:0.25,b:0})
        game.addBox(0,-2,10,100,100,1,game.things,"Part6", {r:0.5,g:0.25,b:0})
        
        const nb2 = game.addBall(0,2,0,1,game.things,"bol",{r:0,g:1,b:0.5})
        const nb = game.addBall(0.1,4,0,1,game.things,"bol2",{r:0,g:1,b:0.5})
        nb.anchored=false
        nb2.anchored=false

        const nb3 = game.addBall(0.2,6,0,1,game.things,"bol3",{r:0,g:1,b:0.5})
        const n4 = game.addBall(-0.1,8,0.1,1,game.things,"bol4",{r:0,g:1,b:0.5})
        nb3.anchored=false
        n4.anchored=false

        const nb5 = game.addBall(0.2,10,0,1,game.things,"bol5",{r:0,g:1,b:0.5})
        const n6 = game.addBall(-0.1,12,0.1,1,game.things,"bol6",{r:0,g:1,b:0.5})
        nb5.anchored=false
        n6.anchored=false
        // spawn many balls inside the camera frustum (lower start and tighter spacing)
        const startY = 3;
        const spacing = 0.5;
        for (let i=0;i<80;i++){
            const b = game.addBall(
                (Math.random()-0.5)*5,
                startY + (i*spacing),
                (Math.random()-0.5)*5,
                1.5,
                game.things,
                "ball"+i,
                {r:Math.random(),g:Math.random(),b:Math.random()}
            )
            b.anchored=false
        }
        console.log("balls created:", Object.keys(game.things).filter(k=>k.startsWith("ball")).length)
    })
}
main().catch((reason)=>{alert(reason)})