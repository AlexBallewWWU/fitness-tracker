import React, { useContext, useEffect, useState } from 'react'
import './SpotifyTab.css'
import { accessContext } from '../App'
import logo from './img/spotifyIcon.png'
export { HookToSpotify }

var accessToken = '';
var playlistInfo = '';
var reccomendedSong = '';
var reccomendedSongAlbum = '';

const PLAYLIST = "https://api.spotify.com/v1/playlists"

export default function SpotifyTab() {

    const [hasLoaded, setHasLoaded] = useState(false);
    var {linkSpotify} = useContext(accessContext);

    useEffect(() => {  // only need to run once
        setHasLoaded(true);
    }, [])

    function linkToSpotify() {
        linkSpotify(true);
    }

    if (hasLoaded == true) {  // need api requests to finish first, may change this to useState and load image when finished later
        return (
            <div className='container'>
                <img src={logo} className='spotifySymbol'></img>
                <div className='spotifyTab'>
                    <p style={{fontSize: '2vw', margin: 0}}> Use Email: <span style={{fontSize: '2vw', color: 'green'}}> spotifytester2004@@gmail.com </span></p>
                    <p style={{fontSize: '2vw', margin: "2%"}}> Use Password: <span style={{fontSize: '2vw', color: 'green'}}> One4All$15 </span></p>

                    <div className='spotifyLink' onClick={linkToSpotify}>
                        <p style={{fontSize: '1vw', margin: 0}}> Click to link to Spotify</p>
                    </div>
                </div>
            </div>
        )
    }
}

function HookToSpotify() {

    const [hasLoaded, setHasLoaded] = useState(false);
    var {access} = useContext(accessContext);

    useEffect(() => {  // only need to run once
            if (access.length != '') { // prevents error from reading track before access is given
                accessToken = access.access_token;
                getRecPlaylist().then( (res) => {
                    if (reccomendedSong == '') { // check to make sure we're not reseting rec song of workout
                        playlistInfo = res;
                        const recSong = Math.floor(Math.random() * playlistInfo.total);
                        reccomendedSong = playlistInfo.items[recSong].track.name;
                        reccomendedSongAlbum = playlistInfo.items[recSong].track.album.images[0].url
                    }
                    setHasLoaded(true);
                })
            }
    }, [])

    if (hasLoaded == true) {  // need api requests to finish first, may change this to useState and load image when finished later
        return (
            <div className='finishedSpotifyTab'>
                <img src={logo} className='spotifySymbol'></img>
                <p style={{fontSize: '2.5vw', margin: 0}}>
                    Creators Recommended Song of The Workout: &nbsp;  
                    <span style={{color: 'green', fontSize: '2.5vw'}}>{reccomendedSong}</span>
                </p>
                <img src={reccomendedSongAlbum} className='album'></img>
            </div>
        )
    }
}

async function getRecPlaylist() {

    let recPlaylist = PLAYLIST.slice();
    recPlaylist += "/236Ff7pY1vMNVcxA7mpC9V/tracks"

    const response = await fetch(recPlaylist, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    });
    return response.json();
}