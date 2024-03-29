﻿#include<sceneUboDeclaration>
#include<meshUboDeclaration>

// Attributes
attribute position : vec3<f32>;
attribute normal : vec3<f32>;
attribute uv: vec2<f32>;

// Varying
varying vPosition : vec3<f32>;
varying vNormal : vec3<f32>;
varying vUV : vec2<f32>;

@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    let outPosition = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position, 1.0);
    vertexOutputs.position = outPosition;

    vertexOutputs.vUV = vertexInputs.uv;
    vertexOutputs.vPosition = vertexInputs.position;
    vertexOutputs.vNormal = vertexInputs.normal;
}