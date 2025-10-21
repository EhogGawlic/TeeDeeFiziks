
import * as mat4 from './toji-gl-matrix-1f872b8/src/mat4.js'
export class triangleBuffer {
    inds = []
    verts = []
    vbuffer = []
    ibuffer = []
    gl
    ind = 0
    boxes=[]
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl) {
        this.vbuffer = null
        this.ibuffer = null
        this.gl = gl
        this.indexCount = 0
    }
    updateBuffers(){
        // bind provided buffers if available
        if(this.vbo) this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
        if(this.ibo) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verts), this.gl.DYNAMIC_DRAW)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.inds), this.gl.DYNAMIC_DRAW)
        this.indexCount = this.inds.length
    }
    addQuad(x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,nx,ny,nz,r,g,b){
        this.verts.push(
            x1,y1,z1,r,g,b,nx,ny,nz,
            x2,y2,z2,r,g,b,nx,ny,nz,
            x3,y3,z3,r,g,b,nx,ny,nz,
            x4,y4,z4,r,g,b,nx,ny,nz
        )
        this.inds.push(this.ind,this.ind+1,this.ind+2,this.ind,this.ind+2,this.ind+3)
        this.ind+=4
    }
    addBox(x,y,z,w,h,d,color){
        const x0 = x - w/2
        const x1 = x + w/2
        const y0 = y - h/2
        const y1 = y + h/2
        const z0 = z - d/2
        const z1 = z + d/2
        const baseind = this.ind // eh 1 character shorter
        const s3 = 1/Math.sqrt(3)
            const [r,g,b] = [color.r, color.g, color.b];

            this.addQuad(
                x0, y0, z1,
                x1, y0, z1,
                x1, y1, z1,
                x0, y1, z1,
                0, 0, 1,
                r, g, b
            );

            this.addQuad(
                x1, y0, z0,
                x0, y0, z0,
                x0, y1, z0,
                x1, y1, z0,
                0, 0, -1,
                r, g, b
            );

            this.addQuad(
                x0, y0, z0,
                x0, y0, z1,
                x0, y1, z1,
                x0, y1, z0,
                -1, 0, 0,
                r, g, b
            );

            this.addQuad(
                x1, y0, z1,
                x1, y0, z0,
                x1, y1, z0,
                x1, y1, z1,
                1, 0, 0,
                r, g, b
            );

            this.addQuad(
                x0, y1, z1,
                x1, y1, z1,
                x1, y1, z0,
                x0, y1, z0,
                0, 1, 0,
                r, g, b
            );

            this.addQuad(
                x0, y0, z0,
                x1, y0, z0,
                x1, y0, z1,
                x0, y0, z1,
                0, -1, 0,
                r, g, b
            );
            this.boxes.push({start:this.ind-24,end:this.ind,sverts:this.verts.slice(this.ind-24,this.ind)})
        this.updateBuffers()
    }
    moveVerts(startInd,endInd,x,y,z){
        for (let i = startInd; i < endInd; i++){
            const vi = i*9
            this.verts[vi]+=x
            this.verts[vi+1]+=y
            this.verts[vi+2]+=z
        }
        this.updateBuffers()
    }
    moveBoxTo(boxn,x,y,z){
        const box = this.boxes[boxn]
        for (let vi = box.start; vi < box.end; vi+=9){
            const i = vi-box.start
            const vert = box.sverts.slice(i,i+9)
            this.verts[vi] = vert[0]+x+67
            this.verts[vi+1] = vert[1]+y+67
            this.verts[vi+2] = vert[2]+z+67
        }
        this.updateBuffers()

    }
}
export class Scene {
    buffer
    lightdir
    lightcol
    ambient
    camera
    gl
    lookat
    prog
    /**
     * 
     * @param {Array<Number>} lightdir 
     * @param {Array<Number>} lightcol 
     * @param {Array<Number>} ambient 
     * @param {Array<Number>} camera 
     * @param {Number} fov 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(lightdir,lightcol,ambient,camera,lookat,gl,prog){
        this.lightdir = lightdir
        this.lightcol = lightcol
        this.ambient = ambient
        this.camera=camera
        this.fov=fov
        this.gl=gl
        this.lookat=lookat
        this.prog=prog
        this.buffer = new triangleBuffer(gl)
        const ldloc = gl.getUniformLocation(prog, 'lightdir')
        const lcloc = gl.getUniformLocation(prog, 'lightColor')
        const acloc = gl.getUniformLocation(prog, 'ambientColor')
        gl.uniform3fv(ldloc,lightdir)
        gl.uniform3fv(lcloc,lightcol)
        gl.uniform3fv(acloc,ambient)
        const cameram = mat4.create()
        mat4.lookAt(camera, camera, lookat, [0, 1, 0])
        const vmatloc = gl.getUniformLocation(prog, 'vmat')
        gl.uniformMatrix4fv(vmatloc, false, cameram)
    }

}
export class Camera {
    pos = [0,5,-10]
    lookat = [0,0,0]
    gl
    prog
    cammat
    lookdir=[0,0,0]
    /**
     * 
     * @param {Array<Number>} pos 
     * @param {Array<Number>} lookingat 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(pos,lookingat,gl,program){
        this.pos = pos
        this.lookat = lookingat
        this.gl=gl
        this.prog=program
        this.cammat = mat4.create()
        this.getLookDir()
        mat4.lookAt(this.cammat,pos,lookingat,[0,1,0])
    }
    getLookDir(){
        const dist = Math.sqrt((this.pos[0]-this.lookat[0])*(this.pos[1]-this.lookat[1])*(this.pos[2]-this.lookat[2]))
        this.lookdir[0] = (this.pos[0]-this.lookat[0])/dist
        this.lookdir[1] = (this.pos[1]-this.lookat[1])/dist
        this.lookdir[2] = (this.pos[2]-this.lookat[2])/dist
    }
    updateCam(){

        mat4.lookAt(this.cammat,this.pos,this.lookat,[0,1,0])
        const vmatloc = this.gl.getUniformLocation(this.prog, 'vmat')
        this.gl.uniformMatrix4fv(vmatloc, false, this.cammat)
    }
    moveCamTo(pos){
        this.pos = pos
    }
    moveCam(movement){
        this.pos = [this.pos[0]+movement[0],this.pos[1]+movement[1],this.pos[2]+movement[2]]
        this.lookat = [this.lookat[0]+movement[0],this.lookat[1]+movement[1],this.lookat[2]+movement[2]]
    }
    moveCam2(movement){
        // Interpret movement as [forward, up, strafe]
        // rotate the forward/strafing to match the camera's yaw (horizontal look direction)
        
            const forwardInput = movement[2] || 0
            const upInput = movement[1] || 0
            const strafeInput = movement[0] || 0

            // world-space forward = lookat - pos, flattened to XZ to ignore pitch for horizontal motion
            let fx = this.lookat[0] - this.pos[0]
            let fz = this.lookat[2] - this.pos[2]
            const fh = Math.hypot(fx, fz)
            if (fh > 1e-6) {
                fx /= fh
                fz /= fh
            } else {
                fx = 0
                fz = 1
            }

            // right = normalize(cross(forward, up))
            // with up = [0,1,0], right = [fz, 0, -fx]
            let rx = fz
            let ry = 0
            let rz = -fx
            const rd = Math.hypot(rx, ry, rz)
            if (rd > 1e-6) {
                rx /= rd
                ry /= rd
                rz /= rd
            } else {
                rx = 1; ry = 0; rz = 0
            }

            // compose world movement
            movement = [
                fx * forwardInput + rx * strafeInput,
                upInput,
                fz * forwardInput + rz * strafeInput
            ]
        

        this.pos = [this.pos[0]+movement[0],this.pos[1]+movement[1],this.pos[2]+movement[2]]
        this.lookat = [this.lookat[0]+movement[0],this.lookat[1]+movement[1],this.lookat[2]+movement[2]]

    }
    rotCam(angle){
        try{
        this.lookdir = [Math.sin(angle),0,Math.cos(angle)]
        this.lookat = [this.pos[0]+this.lookdir[0],this.pos[1]+this.lookdir[1],this.pos[2]+this.lookdir[2]]
       
        }catch(e){alert(e)}
    }
}