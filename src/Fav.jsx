import { spotifyAPI } from './api/spotifyAPI';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Fav = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);
  const [deviceID, setDeviceID] = useState('');

  const userId = localStorage.getItem("UserId");

  const handleGetFavorites = async () => {
    if (!userId) return;
    const url = `http://localhost:3000/api/users/${userId}/favorites`;
    const result = await spotifyAPI(url, "GET", null, null);
    if (Array.isArray(result)) {
      setFavorites(result);
    } else {
      setFavorites([]);
    }
  };

  const handleDeleteFavorites = async (favorite) => {
    if (!userId) return;
    const url = `http://localhost:3000/api/users/${userId}/favorites/delete`;
    const data = JSON.stringify(favorite);
    const result = await spotifyAPI(url, "DELETE", data, null);
    console.log("Deleted favorite:", favorite);
    setRefreshFavorites(prev => !prev);
  };

  const showDashboard = () => {
    navigate("/dashboard");
  };

  const getDeviceID = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const url = "https://api.spotify.com/v1/me/player/devices";
    const response = await spotifyAPI(url, 'GET', null, token);
    if (response?.devices?.length > 0) {
      setDeviceID(response.devices[0].id);
    }
  };

  const handlePlay = async (songUri) => {
    if (!deviceID) {
      alert("No device selected");
      return;
    }
    const token = localStorage.getItem("access_token");
    const data = JSON.stringify({ uris: [songUri] });
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`;
    const play = await spotifyAPI(url, 'PUT', data, token);
    console.log(play);
  };

  useEffect(() => {
    getDeviceID();
    handleGetFavorites();
  }, [refreshFavorites]);

  return (
    <div className="container-main-favs">
      <div className="container-log-favs">
        <div className="main-text">Favorites</div>
        <button className="input-button" onClick={showDashboard}>Go back</button>

        {favorites.length === 0 && <p>No favorites found.</p>}

        {favorites.map((favorite) => {
          const item = favorite.items;
          return (
            <div key={item.id} className="track-container">
              <div>
                <img
                  src={item?.album?.images?.[0]?.url || ""}
                  width={150}
                  alt="Album Cover"
                />
              </div>
              <div className="song-title">
                <p>{item?.name || "Unknown"}</p>
              </div>
              <div className="button-container">
                <button
                  className="track-button"
                  onClick={() => handlePlay(item.uri)}
                >
                  ▶
                </button>
                <button
                  className="track-button"
                  onClick={() => handleDeleteFavorites(item)}
                >
                  ✖
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fav;
