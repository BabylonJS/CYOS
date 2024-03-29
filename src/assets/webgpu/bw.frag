﻿varying vUV : vec2<f32>;

var diffuse : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let luminance  = dot(textureSample(diffuse, mySampler, fragmentInputs.vUV).rgb, vec3<f32>(0.3, 0.59, 0.11));
    fragmentOutputs.color = vec4(luminance, luminance, luminance, 1.0);
}