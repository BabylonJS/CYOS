#version 300 es
precision highp float;

in vec2 vUV;

// Refs
uniform sampler2D textureSampler;

out vec4 fragColor;

void main(void) {
    vec3 color = texture(textureSampler, vUV).rgb;

    if (color.g > 0.5) {
        discard;
    }

    fragColor = vec4(color, 1.);
}