// Varying
varying vPositionW : vec3<f32>;
varying vNormalW : vec3<f32>;

uniform cameraPosition : vec3<f32>;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let color = vec3(1., 1., 1.);
    let viewDirectionW = normalize(uniforms.cameraPosition - fragmentInputs.vPositionW);

    // Fresnel
    var fresnelTerm = dot(viewDirectionW, fragmentInputs.vNormalW);
    fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);

    fragmentOutputs.color = vec4 (color * fresnelTerm, 1.);
}