#include<sceneUboDeclaration>
#include<meshUboDeclaration>

// Attributes
attribute position : vec3<f32>;
attribute normal : vec3<f32>;
attribute uv: vec2<f32>;

// Varying
varying vPositionW : vec3<f32>;
varying vNormalW : vec3<f32>;

@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    let outPosition = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position, 1.0);
    vertexOutputs.position = outPosition;

    vertexOutputs.vPositionW = (mesh.world * vec4(vertexInputs.position, 1.0)).xyz;
    vertexOutputs.vNormalW = normalize((mesh.world * vec4(vertexInputs.normal, 0.0)).xyz);
}