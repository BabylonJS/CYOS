#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float time;

// Varying
out vec3 vPosition;
out vec3 vNormal;
out vec2 vUV;

void main(void) {
    vec3 v = position;
    v.x += sin(2.0 * position.y + (time)) * 0.5;

    gl_Position = worldViewProjection * vec4(v, 1.0);

    vPosition = position;
    vNormal = normal;
    vUV = uv;
}