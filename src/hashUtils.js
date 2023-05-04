let currentSnippetToken;
let previousHash = "";

function cleanHash() {
    let splits = decodeURIComponent(location.hash.substr(1)).split("#");

    if (splits.length > 2) {
        splits.splice(2, splits.length - 2);
    }

    location.hash = splits.join("#");
}

export function checkHash() {
    if (location.hash) {
        if (previousHash != location.hash) {
            cleanHash();

            previousHash = location.hash;

            try {
                const xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            document.getElementById("templates").value = "";

                            const snippet = JSON.parse(JSON.parse(xmlHttp.responseText).jsonPayload);

                            vertexEditor.setValue(snippet.vertexShader);
                            vertexEditor.gotoLine(0);

                            pixelEditor.setValue(snippet.pixelShader);
                            pixelEditor.gotoLine(0);

                            if (snippet.meshId) {
                                document.getElementById("meshes").selectedIndex = snippet.meshId;
                                selectMesh();
                            }

                            compile();
                        }
                    }
                }

                var hash = location.hash.substr(1);
                currentSnippetToken = hash.split("#")[0];
                xmlHttp.open("GET", snippetUrl + "/" + hash.replace("#", "/"));
                xmlHttp.send();
            } catch (e) {

            }
        }
    }

    setTimeout(checkHash, 200);
}