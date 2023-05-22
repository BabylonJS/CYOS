// Retrieves the given shader from the server
export async function loadShader(filename) {
    try {
        return fetch(filename).then(v => v.text());
    } catch (err) {
        return "";
    }
}