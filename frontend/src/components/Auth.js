export { requestAuth }

var redirect_uri = "https://fitness-tracker-frontend-c27dcf177753.herokuapp.com"
// var redirect_uri = "http://127.0.0.1:3000"
var client_id = '';
var client_secret = '';
var access = '';
var accessToken = '';

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"

async function requestAuth(curAccess){

    // get client_id and secret from backend
    var codes = await getKeys();
    client_id = codes.client_id;
    client_secret = codes.client_secret;

    if(curAccess.expires_in > 0){
        return access;
    }

    if(window.location.search.substring("code")){
        await handleCode();
        return access;
    }

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&user-read-recently-played"
    url += "&playlist-read-private"
    window.location.href = url;
}

async function getKeys() {
    return fetch('https://fitness-tracker2024-8f04514422ed.herokuapp.com/keys', {
            method : 'GET'
    }).then(
        (response) => response.json()
    ).then(
        data => {return data}
    )
}

async function handleCode(){
    if (!window.location.search.substring("code")) {
        return;
    }
            // returns object with all url params
    let urlParams = new URLSearchParams(window.location.search);
    let authCode = urlParams.get("code");

    await getAccessToken(authCode).then((res) => {
        access = res;
        accessToken = access.access_token;
        return res;
    });
}

async function getAccessToken(code){
    var details = {
        'grant_type' : 'authorization_code',
        'code' : code,
        'redirect_uri' : encodeURI(redirect_uri)
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(TOKEN, {
        method: "POST",
        mode: "cors",

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
        },

        body: formBody
      });
      return response.json();
}