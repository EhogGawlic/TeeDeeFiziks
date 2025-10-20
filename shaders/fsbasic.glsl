precision mediump float;
uniform vec3 lightColor;
uniform vec3 ambientColor;
varying vec3 vColor;
void main(void) {
    gl_FragColor = vec4(vColor * lightColor + ambientColor, 1.0);
}