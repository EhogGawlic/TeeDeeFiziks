precision mediump float;
uniform vec3 lightColor;
uniform vec3 ambientColor;
varying vec3 vColor;
varying vec2 vTexcoord;
varying sampler2D vTexture;
void main(void) {
    
    vec4 texColor = texture2D(vTexture, vTexcoord);
    vColor = vColor * texColor.rgb;

    gl_FragColor = vec4(vColor * lightColor + ambientColor, 1.0);
}