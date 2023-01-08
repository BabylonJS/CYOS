#version 300 es
precision highp float;

in vec2 vUV;

uniform sampler2D textureSampler;

out vec4 fragColor;

void main(void) {
    fragColor = texture(textureSampler, vUV);
}