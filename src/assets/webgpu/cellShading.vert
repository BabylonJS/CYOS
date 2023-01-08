#include<sceneUboDeclaration>
#include<meshUboDeclaration>

attribute position : vec3<f32>;
attribute normal : vec3<f32>;
attribute uv: vec2<f32>;

varying vPositionW : vec3<f32>;
varying vNormalW : vec3<f32>;
varying vUV : vec2<f32>;


@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    let outPosition = scene.viewProjection * mesh.world * vec4<f32>(position, 1.0);
    gl_Position = outPosition;

    vPositionW = (mesh.world * vec4(position, 1.0)).xyz;
    vNormalW = normalize((mesh.world * vec4(normal, 0.0)).xyz);

    vUV = uv;
}