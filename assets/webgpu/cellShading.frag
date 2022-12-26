varying vPositionW : vec3<f32>;
varying vNormalW : vec3<f32>;

varying vUV : vec2<f32>;

var diffuse : texture_2d<f32>;
var mySampler : sampler;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    var ToonThresholds : array<f32, 4>;
    ToonThresholds[0] = 0.95;
    ToonThresholds[1] = 0.5;
    ToonThresholds[2] = 0.2;
    ToonThresholds[3] = 0.03;

    var ToonBrightnessLevels : array<f32, 5>;
    ToonBrightnessLevels[0] = 1.0;
    ToonBrightnessLevels[1] = 0.8;
    ToonBrightnessLevels[2] = 0.6;
    ToonBrightnessLevels[3] = 0.35;
    ToonBrightnessLevels[4] = 0.2;

    let vLightPosition = vec3<f32>(0,20,10);

    // Light
    let lightVectorW = normalize(vLightPosition - vPositionW);

    // diffuse
    let ndl = max(0., dot(vNormalW, lightVectorW));

    var color = textureSample(diffuse, mySampler, vUV).rgb;

    if (ndl > ToonThresholds[0])
    {
        color *= ToonBrightnessLevels[0];
    }
    else if (ndl > ToonThresholds[1])
    {
        color *= ToonBrightnessLevels[1];
    }
    else if (ndl > ToonThresholds[2])
    {
        color *= ToonBrightnessLevels[2];
    }
    else if (ndl > ToonThresholds[3])
    {
        color *= ToonBrightnessLevels[3];
    }
    else
    {
        color *= ToonBrightnessLevels[4];
    }

    gl_FragColor = vec4(color, 1.);
}