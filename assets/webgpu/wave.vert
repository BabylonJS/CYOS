#include<sceneUboDeclaration>
#include<meshUboDeclaration>

// Attributes
attribute position : vec3<f32>;
attribute normal : vec3<f32>;
attribute uv: vec2<f32>;

// uniforms
uniform time : f32;

// Varying
varying vPosition : vec3<f32>;
varying vNormal : vec3<f32>;
varying vUV : vec2<f32>;

@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    let v = position + sin(2.0 * position.y + (uniforms.time)) * 0.5;
    let outPosition = scene.viewProjection * mesh.world * vec4<f32>(position, 1.0);
    gl_Position = scene.viewProjection * mesh.world * vec4(v, 1.0);

    vUV = uv;
    vPosition = position;
    vNormal = normal;
}