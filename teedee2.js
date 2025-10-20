import * as teedee from "./teedee.js"
async function main(){
    const {gl, vbo, ibo, stype, prog,buffer} = await teedee.initall('glcanvas', 'shaded')
    console.log('inited')
    buffer.addBox(0,0,0,2,2,2,{r:1.0,g:0.0,b:0.0})
    console.log(vbo,ibo)
    
    async function loop(){
        
        await teedee.render(gl, prog, vbo, ibo, buffer)
        requestAnimationFrame(loop)
    }
    loop()
}

main()