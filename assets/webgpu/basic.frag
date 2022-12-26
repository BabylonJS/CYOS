varying vUV : vec2<f32>;

var diffuse : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    gl_FragColor = textureSample(diffuse, mySampler, vUV);
}