#version 300 es
precision highp float;

// Varying
in vec3 vPosition;
in vec3 vNormal;
in vec2 vUV;

// Uniforms
uniform mat4 world;

// Refs
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;

out vec4 fragColor;

void main(void) {
    vec3 vLightPosition = vec3(0,20,10);

    // World values
    vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));
    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

    // Light
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    vec3 color = texture(textureSampler, vUV).rgb;

    // diffuse
    float ndl = max(0., dot(vNormalW, lightVectorW));

    // Specular
    vec3 angleW = normalize(viewDirectionW + lightVectorW);
    float specComp = max(0., dot(vNormalW, angleW));
    specComp = pow(specComp, max(1., 64.)) * 2.;

    fragColor = vec4(color * ndl + vec3(specComp), 1.);
}