import './fileSaver.js';

export const snippetUrl = "https://snippet.babylonjs.com";

let currentSnippetToken;

function stringifyShader(name, data, renderingEngine) {
    let text = "";

    text = `                BABYLON.ShaderStore.${renderingEngine === "webgpu" ? "ShadersStoreWGSL" : "ShadersStore"}["${name}"]=\``;
    text += data;
    text += "`\n";

    return text;
}

async function addContentToZip(zip, name, url, replace, buffer, then) {
    try {
        const response = await fetch(url);

        let text;
        if (!buffer) {
            text = await response.text();
            if (replace) {
                text = text.replace("####INJECT####", replace);
            }
        }

        zip.file(name, buffer ? await response.arrayBuffer() : text);
    } catch (err) {
        // failed
        console.error(err);
    }
}

export function saveFunction(vertexShaderSrc, pixelShaderSrc) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var baseUrl = location.href.replace(location.hash, "").replace(location.search, "");
                var snippet = JSON.parse(xmlHttp.responseText);
                var newUrl = baseUrl + "#" + snippet.id;
                currentSnippetToken = snippet.id;
                if (snippet.version && snippet.version != "0") {
                    newUrl += "#" + snippet.version;
                }
                location.href = newUrl;
                //compile();
            }
            else {
                console.log("Unable to save your code. Please retry.", null);
            }
        }
    }

    xmlHttp.open("POST", snippetUrl + (currentSnippetToken ? "/" + currentSnippetToken : ""), true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");

    const dataToSend = {
        payload: JSON.stringify({
            vertexShader: vertexShaderSrc,
            pixelShader: pixelShaderSrc,
            meshId: document.getElementById("meshes").selectedIndex
        }),
        name: "",
        description: "",
        tags: ""
    };

    xmlHttp.send(JSON.stringify(dataToSend));
}

export function getZip(vertexShaderSrc, pixelShaderSrc, renderingEngine) {
    /*if (engine.scenes.length == 0) {
        return;
    }*/

    let zip = new JSZip();

    //var scene = engine.scenes[0];

    //var textures = scene.textures;

    document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Creating archive...Please wait</span><BR>" + document.getElementById("errorLog").innerHTML;

    var zipCode = "var renderingEngine = \"" + renderingEngine + "\";\n";

    zipCode += stringifyShader("customVertexShader", vertexShaderSrc, renderingEngine);

    zipCode += "\n" + stringifyShader("customFragmentShader", pixelShaderSrc, renderingEngine) + "\n";
    zipCode += "                var selectedMesh =" + document.getElementById("meshes").selectedIndex + ";\n"

    let requests = [];
    requests.push(addContentToZip(zip, "index.html", "zipContent/index.html", zipCode, false));
    requests.push(addContentToZip(zip, "ref.jpg", "ref.jpg", null, true));
    requests.push(addContentToZip(zip, "heightMap.png", "heightMap.png", null, true));
    requests.push(addContentToZip(zip, "amiga.jpg", "amiga.jpg", null, true));

    Promise.all(requests).then(() => {
        var blob = zip.generate({ type: "blob" });
        saveAs(blob, "sample.zip");
        document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Archive created successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
    });
}