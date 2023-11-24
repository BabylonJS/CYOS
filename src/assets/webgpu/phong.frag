// Varying
varying vPosition : vec3<f32>;
varying vNormal : vec3<f32>;
varying vUV : vec2<f32>;

// Uniforms
uniform world: mat4x4<f32>;

// Refs
uniform cameraPosition: vec3<f32>;

var textureSampler : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let vLightPosition = vec3(0.0,20.0,10.0);

    // World values
    let vPositionW = (uniforms.world * vec4(fragmentInputs.vPosition, 1.0)).xyz;
    let vNormalW = normalize((uniforms.world * vec4(fragmentInputs.vNormal, 0.0)).xyz);
    let viewDirectionW = normalize(uniforms.cameraPosition - vPositionW);

    // Light
    let lightVectorW = normalize(vLightPosition - vPositionW);
    let color = textureSample(textureSampler, mySampler, fragmentInputs.vUV).rgb;

    // diffuse
    let ndl = max(0., dot(vNormalW, lightVectorW));

    // Specular
    let angleW = normalize(viewDirectionW + lightVectorW);
    let specComp = max(0., dot(vNormalW, angleW));
    let specComp2 = pow(specComp, max(1., 64.)) * 2.;

    fragmentOutputs.color = vec4(color * ndl + vec3(specComp2), 1.);
}