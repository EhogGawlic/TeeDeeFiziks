import * as teedee from "./teedee.js"
import { triangleBuffer, Scene } from "./utils.js"

async function main(){

    const {gl, vbo, ibo, stype, prog,buffer} = await teedee.initall('glcanvas', 'shaded')
    console.log('inited')
    buffer.addBox(0,0,0,1.5,2,2,{r:1.0,g:0.0,b:0.0})

    buffer.addBox(0,2,0,1.5,1.5,1.5,{r:1.0,g:0.0,b:0.0})
    buffer.addBox(1.5,0,0,1.5,2,1.5,{r:1.0,g:0.0,b:0.0})
    buffer.addBox(0,-2,0,50,2,50,{r:0.9,g:0.77,b:0.56})
    console.log(vbo,ibo)
    //const scene = new Scene([5,5,5],[1,0.9,0.8],[0.1,0.09,0.08],[0,3,-50],[0,0,0],gl, prog)
    teedee.movecamera([0,5,-10],gl)
    let x = 0
    async function loop(){
        
        await teedee.render(gl, prog, vbo, ibo, buffer)
        requestAnimationFrame(loop)
    }
    loop()
}

main()