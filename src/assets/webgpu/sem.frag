uniform worldView : mat4x4<f32>;

varying vPosition : vec4<f32>;
varying vNormal : vec3<f32>;

var diffuse : texture_2d<f32>;
var refSampler : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let e = normalize(uniforms.worldView * fragmentInputs.vPosition).xyz;
    let n = normalize(uniforms.worldView * vec4(fragmentInputs.vNormal, 0.0)).xyz;

    let r = reflect( e, n );

    let m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );

    let vN = r.xy / m + .5;

    let base = textureSample(refSampler, mySampler, vN).rgb;

    fragmentOutputs.color = vec4( base, 1.0);
}