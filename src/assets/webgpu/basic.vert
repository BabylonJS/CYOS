#include<sceneUboDeclaration>
#include<meshUboDeclaration>

// Attributes
attribute position : vec3<f32>;
attribute uv: vec2<f32>;

// Varying
varying vUV : vec2<f32>;

@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position, 1.0);

    vertexOutputs.vUV = vertexInputs.uv;
} 