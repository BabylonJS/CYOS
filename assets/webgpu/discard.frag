varying vUV : vec2<f32>;

var diffuse : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let color = textureSample(diffuse, mySampler, vUV).rgb;
    if (color.g > 0.5) {
        discard;
    }

    gl_FragColor = vec4(color, 1.);
}