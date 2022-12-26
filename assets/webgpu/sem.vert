#include<sceneUboDeclaration>
#include<meshUboDeclaration>

// Attributes
attribute position : vec3<f32>;
attribute normal : vec3<f32>;

// Varying
varying vPosition : vec4<f32>;
varying vNormal : vec3<f32>;

@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    let p = vec4<f32>(position, 1.0);
    vPosition = p;
    vNormal = normal;

    gl_Position = scene.viewProjection * mesh.world * p;
}