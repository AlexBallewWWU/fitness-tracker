export { requestAuth }

var redirect_uri = "https://master.d38l1ktvuoyhfb.amplifyapp.com"
// var redirect_uri = "http://127.0.0.1:3000"
var client_id = 'e65e883011ca4cafbd3b38e703cc92ba';
var client_secret = 'e6b9e6a148aa40bfb1bb7dc658a288c2';
var access = '';
var accessToken = '';

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"

async function requestAuth(curAccess){

    if(curAccess.expires_in > 0){
        return access;
    }

    // might set something up where two options, use your account or use mine
    // not secure, currently only works with my account (maybe change later)
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

async function handleCode(){
    if(!window.location.search.substring("code")){
        return;
    }
            // returns object with all url params
    let urlParams = new URLSearchParams(window.location.search);
    let authCode = urlParams.get("code");

    await getAccessToken(authCode).then((res) =>{
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