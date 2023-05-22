#version 300 es
precision highp float;

in vec2 vUV;

uniform sampler2D textureSampler;

out vec4 fragColor;

void main(void) {
    float luminance = dot(texture(textureSampler, vUV).rgb, vec3(0.3, 0.59, 0.11));
    fragColor = vec4(luminance, luminance, luminance, 1.0);
}