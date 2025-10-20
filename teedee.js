import * as init from './init.js'
import * as mat4 from './toji-gl-matrix-1f872b8/src/mat4.js'
import { triangleBuffer } from "./utils.js"

const pmat = mat4.create()
mat4.perspective(pmat, 45 * Math.PI / 180, 1.0, 0.1, 100.0)
const camera = mat4.create()
mat4.lookAt(camera, [0, 0, -5], [0, 0, 0], [0, 1, 0])
export async function initall(canvasid, stype){
    const {canvas, gl} = init.initCanvas(canvasid)
    const shaders = await init.initShaders(gl, stype)
    console.log(shaders)
    let buffer = new triangleBuffer(shaders.vs, shaders.fs,gl)
    const prog = init.createProgram(gl, shaders.vs, shaders.fs)
    
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.DYNAMIC_DRAW)
    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(0), gl.DYNAMIC_DRAW)
    gl.useProgram(prog)
    const vertLoc = gl.getAttribLocation(prog, 'aPosition')
    const colorLoc = gl.getAttribLocation(prog, 'acolor')
    const pmatloc = gl.getUniformLocation(prog, 'pmat')
    const vmatloc = gl.getUniformLocation(prog, 'vmat')
    switch(stype){
        case 'shaded':
        const normLoc = gl.getAttribLocation(prog, 'anorm')
        gl.vertexAttribPointer(
            vertLoc, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*9, 0    
        )
        
        gl.vertexAttribPointer(
            colorLoc, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*9, Float32Array.BYTES_PER_ELEMENT*3
        )
        gl.vertexAttribPointer(
            normLoc, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*9, Float32Array.BYTES_PER_ELEMENT*6
        )
        gl.enableVertexAttribArray(normLoc)
        break
        default:
            
        gl.vertexAttribPointer(
            vertLoc, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*6, 0    
        )
        
        gl.vertexAttribPointer(
            colorLoc, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*6, Float32Array.BYTES_PER_ELEMENT*3
        )
    }
        gl.enableVertexAttribArray(vertLoc)
        gl.enableVertexAttribArray(colorLoc)
    gl.uniformMatrix4fv(pmatloc, false, pmat)
    gl.uniformMatrix4fv(vmatloc, false, camera)

    return {gl, vbo, ibo, stype, prog, buffer}
}
export async function render(gl,prog) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(prog)
    gl.drawElements(gl.TRIANGLES,0, gl.UNSIGNED_SHORT, 0)
    console.log('rendered a frame')
}