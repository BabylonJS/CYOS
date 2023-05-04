precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float time;

// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

void main(void) {
    vec3 v = position;
    v.x += sin(2.0 * position.y + (time)) * 0.5;

    gl_Position = worldViewProjection * vec4(v, 1.0);

    vPosition = position;
    vNormal = normal;
    vUV = uv;
}