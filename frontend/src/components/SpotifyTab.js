import React, { useContext, useEffect, useState } from 'react'
import './SpotifyTab.css'
import { accessContext } from '../App'
import logo from './img/spotifyIcon.png'

var accessToken = '';
var playlistInfo = '';
var reccomendedSong = '';
var reccomendedSongAlbum = '';

const PLAYLIST = "https://api.spotify.com/v1/playlists"

export default function SpotifyTab(access) {

    const [hasLoaded, setHasLoaded] = useState(false);
    access = useContext(accessContext);

    useEffect(() => {  // only need to run once
        accessToken = access.access_token;
        getRecPlaylist().then( (res) => {
            if(reccomendedSong == ''){ // check to make sure we're not reseting rec song of workout
                playlistInfo = res;
                const recSong = Math.floor(Math.random() * playlistInfo.total - 1); // acount for starting at 0
                reccomendedSong = playlistInfo.items[recSong].track.name;
                reccomendedSongAlbum = playlistInfo.items[recSong].track.album.images[0].url
            }
            setHasLoaded(true);
        })
    }, [])

    if(hasLoaded == true){  // need api requests to finish first, may change this to useState and load image when finished later
        return (
            <div className='spotifyTab'>
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