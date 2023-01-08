#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec3 normal;

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;

// Varying
out vec3 vPositionW;
out vec3 vNormalW;

void main(void) {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;

    vPositionW = vec3(world * vec4(position, 1.0));
    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
}