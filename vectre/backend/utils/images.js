const config = require('../config')
const clientID = config.imgur.clientID

function upload(imageData) {
    const apiURL = 'https://api.imgur.com/3/image';
    return fetch(apiURL, {
        method: 'POST',
        body: imageData,
        headers: {
            'Authorization': 'Client-ID ' + clientID
        }
    })
        .then(response => response.json())
}

function retrieve(body) {
    if(!body.imageURL) {
        throw {
            success: false,
            message: "No image URL in request body"
        }
    }
    const imgHash = getHash(body.imageURL);
    const apiURL = 'https://api.imgur.com/3/image/' + imgHash;
    return fetch(apiURL, {
        method: 'GET',
        headers: {
            'Authorization': 'Client-ID ' + clientID
        }
    })
        .then(response => response.json())

}

function getHash(imageURL) {
    return imageURL.slice(20).replace(/\.[^/.]+$/, "");
}

module.exports = {
    upload,
    retrieve
};