import React, { useContext, useEffect, useState } from 'react'
import './SpotifyTab.css'
import { accessContext } from '../App'

var accessToken = '';
var playlistInfo = '';
var reccomendedSong = '';
var reccomendedSongAlbum = '';

const PLAYLIST = "https://api.spotify.com/v1/playlists"

export default function SpotifyTab(access) {

    const [hasLoaded, setHasLoaded] = useState(false);
    access = useContext(accessContext);

    useEffect(() => {
        accessToken = access.access_token;
        getRecPlaylist().then( (res) => {
            playlistInfo = res;
            const recSong = Math.floor(Math.random() * playlistInfo.total - 1); // acount for starting at 0
            reccomendedSong = playlistInfo.items[recSong].track.name;
            reccomendedSongAlbum = playlistInfo.items[recSong].track.album.images[0].url
            setHasLoaded(true);
        })
    }, [])

    if(hasLoaded == true){
        return (
            <div className='spotifyTab'>
                <text style={{fontSize: '3.4vw'}}>
                    Creators Recommended Song of The Workout: &nbsp;  
                    <text style={{color: 'green', fontSize: '3.4vw'}}>{reccomendedSong}</text>
                </text>
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