var redirect_uri = "http://127.0.0.1:5500/index.html"

var client_id = 'e65e883011ca4cafbd3b38e703cc92ba';
var client_secret = 'e6b9e6a148aa40bfb1bb7dc658a288c2';
var access = '';
var accessToken = '';
// var 

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"
const PLAYLIST = "https://api.spotify.com/v1/playlists"; // maybe don't need last slash

function requestAuth(){

    // might set something up where two options, use your account or use mine
    // not secure, currently only works with my account (maybe change later)
    if(window.location.search.substring("code")){
        return;
    }

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&user-read-recently-played"
    url += "&playlist-read-private"
    window.location.href = url;
    // handleCode();
}

function handleCode(){
    if(!window.location.search.substring("code")){
        return;
    }
            // returns object with all url params
    let urlParams = new URLSearchParams(window.location.search);
    let authCode = urlParams.get("code");
    console.log(authCode);
    getAccessToken(authCode).then((res) =>{
        console.log(res);
        access = res;
        accessToken = access.access_token;
        main();  // call driver of program to let know all the set up is complete
    });
    // console.log("fdoi" + access);
}

async function getAccessToken(code){
    console.log(code);
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

// this is where we will set up the home page
function main(){
    getRecPlaylist().then((res) => {
        console.log(res);
        setUpSpotifyTab(res);
    });
}

async function getRecPlaylist(){

    let recPlaylist = PLAYLIST.slice();
    recPlaylist += "/1qgvuGl9WLKETqNshuaGKP/tracks"

    const response = await fetch(recPlaylist, {
        method: "GET",

        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    });
    return response.json();
}

function setUpSpotifyTab(playlistInfo){
    const songs = playlistInfo.items;
    const recSong = Math.floor(Math.random() * playlistInfo.total - 1); // acount for startign at 0

    // need to create new parent div to have different colors
    var spotifyText = document.getElementById("spotifyText");
    var newText = document.createTextNode(songs[recSong].track.name);
    var textContainer = document.createElement("container");
    textContainer.appendChild(newText);
    textContainer.style.color = "rgb(77, 183, 77)";

    spotifyText.appendChild(textContainer);
    
    var img = songs[recSong].track.album.images[0].url;
    var newImg = document.createElement("img");
    newImg.classList.add("album");
    newImg.src = img;
    var spotifyTab = document.getElementById("spotifyTab");
    spotifyTab.appendChild(newImg);
    console.log(img);
    
}