import * as teedee from "./teedee.js"
import * as mat4 from "./toji-gl-matrix-1f872b8/src/mat4.js"
import { triangleBuffer, Scene, Camera } from "./utils.js"

async function main(){

    const {gl, vbo, ibo, stype, prog,buffer} = await teedee.initall('glcanvas', 'shaded')
    console.log('inited')
    buffer.addBox(0,0,0,1.5,2,2,{r:1.0,g:0.0,b:0.0})

    buffer.addBox(0,2,0,1.5,1.5,1.5,{r:1.0,g:0.0,b:0.0})
    buffer.addBox(0,0,1.5,1,2,1,{r:1.0,g:0.0,b:0.0})
    buffer.addBox(0,0,-1.5,1,2,1,{r:1.0,g:0.0,b:0.0})
    buffer.addBox(0,-2,0,50,2,50,{r:0.9,g:0.77,b:0.56})
    console.log(vbo,ibo)
    //const scene = new Scene([5,5,5],[1,0.9,0.8],[0.1,0.09,0.08],[0,3,-50],[0,0,0],gl, prog)
    const cam = new Camera([0,5,-10],[0,0,0],gl,prog)
    cam.updateCam()
    let x = 0
    let camera = teedee.tcamera
    async function loop(){
        //cam.moveCam([Math.sin(x)*10,5,Math.cos(x)*10])
        //cam.updateCam()
        await teedee.render(gl, prog, vbo, ibo, buffer)
        x+=0.01
        requestAnimationFrame(loop)
    }
    addEventListener("keypress", (e)=>{
        try{
        switch(e.key){
            case "w":
                cam.moveCam2([0,0,0.5])
                break
            case "a":
                cam.moveCam2([0.5,0,0])
                break
            case "d":
                cam.moveCam2([-0.5,0,0])
                break
            case "s":
                cam.moveCam2([0,0,-0.5])
        }
        cam.updateCam()
    }catch(e){alert(e)}
    })
    loop()
}

main()