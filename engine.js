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
    v = [0,0,0]
    anchored=true
    things
    /**
     * 
     * @param {String} shape 
     * @param {triangleBuffer} buffer 
     * @param {Array<Number>|Number} size 
     */
    constructor(shape,buffer,size,color,things){
        this.things=things
        this.sz=size
        this.si = buffer.ind+0
        this.buf=buffer
        this.shape=shape
        this.color=color
        switch(shape){
            case 'box':
                buffer.addBox(this.pos[0],this.pos[1],this.pos[2],this.sz[0],this.sz[1],this.sz[2],this.color)
                this.ei = buffer.ind+0
                this.bi = buffer.boxes.length-1
                break
            case 'ball':
                this.anchored=false
                buffer.addBall(this.sz,this.pos[0],this.pos[1],this.pos[2],this.color.r,this.color.g,this.color.b)
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
        this.buf.updateBuffers()
        this.pos = [x,y,z]
    }
    update(){
        if (!this.anchored){
            this.pos =[
                this.pos[0]+this.v[0],
                this.pos[1]+this.v[1],
                this.pos[2]+this.v[2]
            ]
            this.v[1]-=0.01
            this.moveTo(this.pos[0],this.pos[1],this.pos[2])
            //TEST COLLISIONS
            if (this.shape == 'ball'){
                getDescendants(this.things).forEach(other=>{
                    if (other===this) return;
                    if (other.anchored){
                        if (other.shape=='box'){
                            

                        }
                    }
                })
            }
            //collision?*/
        }
        
    }
}
function getDescendants(obj) {
  const result = [];
  const visited = new WeakSet();

  function traverse(currentObj) {
    if (!currentObj || typeof currentObj !== 'object') return;
    if (visited.has(currentObj)) return;
    visited.add(currentObj);

    for (const key in currentObj) {
      if (!Object.prototype.hasOwnProperty.call(currentObj, key)) continue;
      const value = currentObj[key];

      if (value instanceof Shape) {
        result.push(value);
        // Do NOT recurse into Shape instances (they hold a reference back to things)
        continue;
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value);
      }
    }
  }

  traverse(obj);
  return result;
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
    addBox(x,y,z,sx,sy,sz,parent,name,color){
        const box = new Shape("box",this.buffer,[sx,sy,sz],color,this.things)
        box.moveTo(x,y,z)
        parent[name]=box
        return parent[name]
    }
    addBall(x,y,z,rad,parent,name,color){
        const ball = new Shape("ball",this.buffer,rad,color,this.things)
        ball.moveTo(x,y,z)
        parent[name]=ball
        return parent[name]
    }
    render = async()=>{
        await graphics.render(this.gl,this.prog,this.vbo,this.ibo,this.buffer)
        try{
        getDescendants(this.things).forEach(v=>{
            v.update()
        })
    }catch(e){
        alert(e)
    }
        requestAnimationFrame(this.render)
    }
    moveCam(x,y,z){

    }
}