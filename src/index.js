"use strict";

import { loadShader } from './shaders.js';
import { checkHash } from './hashUtils.js';
import { saveFunction, getZip, snippetUrl } from './dataExport.js';


let engine;
let meshes = [];
let scene;
let shaderMaterial;
let vertexEditor;
let pixelEditor;
let renderingId = "webgl-1";
let shaderLanguage;
let webGPUSupported = false;


async function selectTemplate() {
    const select = document.getElementById("templates");
    let vertexId;
    let pixelId;

    switch (select.selectedIndex) {
        case 0:
            vertexId = "basic";
            pixelId = "basic";
            break;
        case 1:
            vertexId = "bw";
            pixelId = "bw";
            break;
        case 2:
            vertexId = "cellShading";
            pixelId = "cellShading";
            break;
        case 3:
            vertexId = "phong";
            pixelId = "phong";
            break;
        case 4:
            vertexId = "discard";
            pixelId = "discard";
            break;
        case 5:
            vertexId = "wave";
            pixelId = "phong";
            break;
        case 6:
            vertexId = "sem";
            pixelId = "sem";
            break;
        case 7:
            vertexId = "fresnel";
            pixelId = "fresnel";
            break;
        default:
            return;
    }

    //location.hash = undefined;

    let src = await loadShader(`assets/${renderingId}/${vertexId}.vert`);
    vertexEditor.setValue(src);
    vertexEditor.gotoLine(0);

    src = await loadShader(`assets/${renderingId}/${pixelId}.frag`);
    pixelEditor.setValue(src);
    pixelEditor.gotoLine(0);

    compile();
};

function compile() {
    // Exceptionally we do not want cache
    if (shaderMaterial) {
        shaderMaterial.dispose(true);
    }

    // Getting data from editors
    document.getElementById("vertexShaderCode").innerHTML = vertexEditor.getValue();
    document.getElementById("fragmentShaderCode").innerHTML = pixelEditor.getValue();

    shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
        vertexElement: "vertexShaderCode",
        fragmentElement: "fragmentShaderCode",
    },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
            uniformBuffers: ["Scene", "Mesh"],
            shaderLanguage: shaderLanguage
        }, false);

    let refTexture = new BABYLON.Texture("ref.jpg", scene);
    refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

    let mainTexture = new BABYLON.Texture("amiga.jpg", scene);

    shaderMaterial.setTexture("textureSampler", mainTexture);
    
    shaderMaterial.setTexture("refSampler", refTexture);
    shaderMaterial.setFloat("time", 0);
    shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
    shaderMaterial.backFaceCulling = false;

    if (webGPUSupported) {
        // Also needed for WebGPU version
        shaderMaterial.setTexture("diffuse", mainTexture);

        const sampler = new BABYLON.TextureSampler();

        sampler.setParameters(); // use the default values
        sampler.samplingMode = BABYLON.Constants.TEXTURE_NEAREST_SAMPLINGMODE;

        shaderMaterial.setTextureSampler("mySampler", sampler);
    }

    for (const mesh of meshes) {
        mesh.material = shaderMaterial
    }

    shaderMaterial.onCompiled = function () {
        document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Shaders compiled successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
        document.getElementById("shadersContainer").style.backgroundColor = "green";
    }
    shaderMaterial.onError = function (sender, errors) {
        document.getElementById("errorLog").innerHTML = "<span class=error>" + new Date().toLocaleTimeString() + ": " + errors + "</span><BR>" + document.getElementById("errorLog").innerHTML;
        document.getElementById("shadersContainer").style.backgroundColor = "red";
    };
};


function selectMesh() {
    const select = document.getElementById("meshes");

    for (const mesh of meshes) {
        mesh.dispose();
    }
    meshes = [];

    switch (select.selectedIndex) {
        case 0:
            // Creating sphere
            meshes.push(BABYLON.Mesh.CreateSphere("mesh", 16, 5, scene));
            break;
        case 1:
            // Creating Torus
            meshes.push(BABYLON.Mesh.CreateTorus("mesh", 5, 1, 32, scene));
            break;
        case 2:
            // Creating Box
            meshes.push(BABYLON.Mesh.CreateBox("mesh", 5, scene));
            break;
        case 3:
            // Creating Torus knot
            meshes.push(BABYLON.Mesh.CreateTorusKnot("mesh", 2, 0.5, 128, 64, 2, 3, scene));
            break;
        case 4:
            meshes.push(BABYLON.Mesh.CreateGroundFromHeightMap("mesh", "heightMap.png", 8, 8, 100, 0, 3, scene, false));
            break;
        case 5:
            document.getElementById("loading").className = "";
            BABYLON.SceneLoader.ImportMesh("", "", "schooner.babylon", scene, function (newMeshes) {
                for (index = 0; index < newMeshes.length; index++) {
                    mesh = newMeshes[index];
                    mesh.material = shaderMaterial;
                    meshes.push(mesh);
                }

                document.getElementById("loading").className = "hidden";
            });
            return;
    }


    for (const mesh of meshes) {
        mesh.material = shaderMaterial
    }
};

function selectRenderAPI() {
    const select = document.getElementById("renderAPI");

    switch (select.selectedIndex) {
        case 0:
            renderingId = "webgl-1";
            shaderLanguage = BABYLON.ShaderLanguage.GLSL;
            break;
        case 1:
            renderingId = "webgl-2";
            shaderLanguage = BABYLON.ShaderLanguage.GLSL;
            break;
        case 2:
            renderingId = "webgpu";
            shaderLanguage = BABYLON.ShaderLanguage.WGSL;
            break;
        default:
            return;
    }

    // re-trigger template selection for the new API
    selectTemplate()
};




function initializeRenderingOptions() {
    var renderAPI = document.getElementById("renderAPI");

    //TODO: This should be dynamically built based on browser capabilities
    renderAPI.options.add(new Option("WebGL 1.0"));
    renderAPI.options.add(new Option("WebGL 2.0"));

    if (webGPUSupported) {
        renderAPI.options.add(new Option("WebGPU"));
    }
}

async function createEngine(canvas) {
    webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
    if (webGPUSupported) {
        const engine = new BABYLON.WebGPUEngine(canvas);
        await engine.initAsync();
        //engine.dbgShowShaderCode = true
        return engine;
    }
    return new BABYLON.Engine(canvas, true);
}


(function () {
    document.addEventListener("DOMContentLoaded", start, false);
  
    async function start() {
        await effectiveStart();
        checkHash(snippetUrl, vertexEditor, pixelEditor, selectMesh, compile);
    }

    async function effectiveStart()  {
        // Editors. Ideally we should have a WGSL mode as well.
        vertexEditor = ace.edit("vertexShaderEditor");
        vertexEditor.setTheme("ace/theme/chrome");
        vertexEditor.getSession().setMode("ace/mode/glsl");
        vertexEditor.setShowPrintMargin(false);

        pixelEditor = ace.edit("fragmentShaderEditor");
        pixelEditor.setTheme("ace/theme/chrome");
        pixelEditor.getSession().setMode("ace/mode/glsl");
        pixelEditor.setShowPrintMargin(false);

        // UI
        document.getElementById("templates").addEventListener("change", selectTemplate, false);
        document.getElementById("meshes").addEventListener("change", selectMesh, false);
        document.getElementById("renderAPI").addEventListener("change", selectRenderAPI, false);
        document.getElementById("compileButton").addEventListener("click", compile, false);

        // Save button
        document.getElementById("saveButton").addEventListener("click", () => {
            saveFunction(vertexEditor.getValue(), pixelEditor.getValue());
        });


        // Get button
        document.getElementById("getButton").addEventListener("click", function () {
            getZip(vertexEditor.getValue(), pixelEditor.getValue(), webGPUSupported);
        });

        // Babylon.js
        if (BABYLON.Engine.isSupported()) {
            var canvas = document.getElementById("renderCanvas");

            engine = await createEngine(canvas);
            scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

            camera.attachControl(canvas, false);
            camera.lowerRadiusLimit = 1;
            camera.minZ = 1.0;

            // now with the engine configure add the set of available rendering modes.
            initializeRenderingOptions();

            selectMesh();

            if (!location.hash) {
                selectTemplate(true);
            }

            var time = 0;
            engine.runRenderLoop(() => {
                if (shaderMaterial) {
                    shaderMaterial.setFloat("time", time);
                    time += 0.02;

                    shaderMaterial.setVector3("cameraPosition", camera.position);
                }

                scene.render();
            });

            window.addEventListener("resize", () => {
                engine.resize();
            });
        }
    };

    
})();
