precision highp float;

varying vec2 vUV;

// Refs
uniform sampler2D textureSampler;

void main(void) {
    vec3 color = texture2D(textureSampler, vUV).rgb;

    if (color.g > 0.5) {
        discard;
    }

    gl_FragColor = vec4(color, 1.);
}