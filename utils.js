export class triangleBuffer {
    inds = []
    verts = []
    vbuffer = []
    ibuffer = []
    gl
    constructor(vbo,ibo,gl) {
        this.vbuffer = vbo
        this.ibuffer = ibo
        this.gl = gl
    }
    updateBuffers(){
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verts), this.gl.DYNAMIC_DRAW)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.inds), this.gl.DYNAMIC_DRAW)
    }
    addBox(x,y,z,w,h,d,color){
        const x0 = x - w/2
        const x1 = x + w/2
        const y0 = y - h/2
        const y1 = y + h/2
        const z0 = z - d/2
        const z1 = z + d/2
        const baseind = this.verts.length / 6
        this.verts.push(
            x0,y0,z1, color.r, color.g, color.b,
            x1,y0,z1, color.r, color.g, color.b,
            x1,y1,z1, color.r, color.g, color.b,
            x0,y1,z1, color.r, color.g, color.b,
            x0,y0,z0, color.r, color.g, color.b,
            x1,y0,z0, color.r, color.g, color.b,
            x1,y1,z0, color.r, color.g, color.b,
            x0,y1,z0, color.r, color.g, color.b,
        )
        this.inds.push(
            baseind+0, baseind+1, baseind+2, baseind+0, baseind+2, baseind+3,
            baseind+1, baseind+5, baseind+6, baseind+1, baseind+6, baseind+2,
            baseind+5, baseind+4, baseind+7, baseind+5, baseind+7, baseind+6,
            baseind+4, baseind+0, baseind+3, baseind+4, baseind+3, baseind+7,
            baseind+3, baseind+2, baseind+6, baseind+3, baseind+6, baseind+7,
            baseind+4, baseind+5, baseind+1, baseind+4, baseind+1, baseind+0,
        )
        console.log(this.verts,this.inds)
        this.updateBuffers()
        console.log('updated buffers')
        //read buffers for debugging
        const readvbuf = new Float32Array(this.verts.length)
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, readvbuf)
        console.log('vbuf:',readvbuf)
        const readibuf = new Uint16Array(this.inds.length)
        this.gl.getBufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, readibuf)
        console.log('ibuf:',readibuf)
    }
}