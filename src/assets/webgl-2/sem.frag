#version 300 es
precision highp float;

uniform mat4 worldView;

in vec4 vPosition;
in vec3 vNormal;

uniform sampler2D textureSampler;
uniform sampler2D refSampler;

out vec4 fragColor;

void main(void) {

    vec3 e = normalize( vec3( worldView * vPosition ) );
    vec3 n = normalize( worldView * vec4(vNormal, 0.0) ).xyz;

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vec2 vN = r.xy / m + .5;

    vec3 base = texture( refSampler, vN).rgb;

    fragColor = vec4( base, 1. );
}