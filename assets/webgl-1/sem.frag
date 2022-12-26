precision highp float;

uniform mat4 worldView;

varying vec4 vPosition;
varying vec3 vNormal;

uniform sampler2D textureSampler;
uniform sampler2D refSampler;

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

    vec3 base = texture2D( refSampler, vN).rgb;

    gl_FragColor = vec4( base, 1. );
}