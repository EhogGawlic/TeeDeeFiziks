import * as graphics from "./teedee.js"
import * as utils from "./utils.js"
import { triangleBuffer, Scene, Camera } from "./utils.js"
class Shape{
    si = 0
    ei = 0
    pos=[0,0,0]
    sz=[1,1,1]
    color={r:1,g:1,b:1}
    buf
    shape
    bi
    /**
     * 
     * @param {String} shape 
     * @param {triangleBuffer} buffer 
     * @param {Array<Number>|Number} size 
     */
    constructor(shape,buffer,size){
        this.size=typeof size == Number ? [size,size,size] : size
        this.si = buffer.ind+0
        this.buf=buffer
        this.shape=shape
        switch(shape){
            case 'box':
                buffer.addBox(this.pos[0],this.pos[1],this.pos[2],this.sz[0],this.sz[1],this.sz[2],this.color)
                this.ei = buffer.ind+0
                this.bi = buffer.boxes.length-1
                break
            case 'ball':
                buffer.addBall(this.sz[0],this.pos[0],this.pos[1],this.pos[2],this.color.r,this.color.g,this.color.b)
                this.ei = buffer.ind+0
                this.bi =buffer.balls.length-1
        }
    }
    moveTo(x,y,z){
        switch(this.shape){
            case 'box':
                this.buf.moveBoxTo(this.bi,x,y,z)
                break
            case 'ball':
                this.buf.moveBallTo(this.bi,x,y,z)
        }
        this.pos = [x,y,z]
    }
}
export class Game{
    things={}
    scripts={}
    buffer
    camera
    gl
    constructor(){
    }
    async init(canvasid,onload){
        const {gl,vbo,ibo,stype,prog,buffer} = await graphics.initall(canvasid,"shaded")
        this.gl=gl
        this.vbo=vbo
        this.ibo=ibo
        this.prog = prog
        this.buffer=buffer
        this.camera = new Camera([0,5,10],[0,0,0],gl,prog)
        this.camera.updateCam()
        onload()
        this.render()
    }
    addBox(x,y,z,sx,sy,sz,parent,name){
        const box = new Shape("box",this.buffer,[sx,sy,sz])
        box.moveTo(x,y,z)
        parent[name]=box
    }
    addBall(x,y,z,rad,parent,name){
        const ball = new Shape("ball",this.buffer,rad)
        ball.moveTo(x,y,z)
        parent[name]=ball
    }
    async render(){
        await graphics.render(this.gl,this.prog,this.vbo,this.ibo,this.buffer)
        requestAnimationFrame(this.render)
    }
    moveCam(x,y,z){

    }
}