import './fileSaver.js';

const snippetUrl = "https://snippet.babylonjs.com";

let currentSnippetToken;

function stringifyShader(name, data, webGPUSupported) {
    let text = "";

    if (webGPUSupported) {
        text = "                BABYLON.Effect.ShadersStoreWGSL[\"" + name + "\"]=";
    } else {
        text = "                BABYLON.Effect.ShadersStore[\"" + name + "\"]=";
    }

    let splits = data.split("\n");
    for (let index = 0; index < splits.length; index++) {

        if (splits[index] !== "") {
            text += "                \"" + splits[index] + "\\r\\n\"";

            if (index != splits.length - 1) {
                text += "+\r\n";
            } else {
                text += ";\r\n";
            }
        } else {
            text += "\r\n";
        }
    }

    return text;
}

function addContentToZip(zip, name, url, replace, buffer, then) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    if (buffer) {
        xhr.responseType = "arraybuffer";
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let text;
                if (!buffer) {
                    if (replace) {
                        text = xhr.responseText.replace("####INJECT####", replace);
                    } else {
                        text = xhr.responseText;
                    }
                }

                zip.file(name, buffer ? xhr.response : text);

                then();
            } else { // Failed
            }
        }
    };

    xhr.send(null);
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

export function getZip(vertexShaderSrc, pixelShaderSrc, webGPUSupported) {
    /*if (engine.scenes.length == 0) {
        return;
    }*/

    let zip = new JSZip();

    //var scene = engine.scenes[0];

    //var textures = scene.textures;

    document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Creating archive...Please wait</span><BR>" + document.getElementById("errorLog").innerHTML;

    var zipCode = stringifyShader("customVertexShader", vertexShaderSrc, webGPUSupported);

    zipCode += "\r\n" + stringifyShader("customFragmentShader", pixelShaderSrc, webGPUSupported) + "\r\n";
    zipCode += "                selectMesh(" + document.getElementById("meshes").selectedIndex + ");\r\n"

    addContentToZip(zip, "index.html", "zipContent/index.html", zipCode, false, function () {
        addContentToZip(zip, "ref.jpg", "ref.jpg", null, true, function () {
            addContentToZip(zip, "heightMap.png", "heightMap.png", null, true, function () {
                addContentToZip(zip, "amiga.jpg", "amiga.jpg", null, true, function () {
                    var blob = zip.generate({ type: "blob" });
                    saveAs(blob, "sample.zip");
                    document.getElementById("errorLog").innerHTML = "<span>" + new Date().toLocaleTimeString() + ": Archive created successfully</span><BR>" + document.getElementById("errorLog").innerHTML;
                });
            });
        });
    });
}