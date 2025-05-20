//Dashboard.jsx
import React, { useState } from "react";
import { spotifyAPI } from "./api/spotifyAPI.js";



const Dashboard = () => {
  const selectTypes = [
    "album",
    "artist",
    "playlist",
    "track",
    "show",
    "episode",
    "audiobook",
  ];
  const [search, setSearch] = useState({
    song: "",
    types: "", 
  });

  const [results, setResult] = useState([]);
  const [deviceId, setDeviceId] = useState("");

  const handleChange = (e) => {
    const { value, name } = e.target;
    const newFom = {
      ...search,
      [name]: value,
    };
    console.log(newFom);
    setSearch(newFom);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    params.append("q", encodeURIComponent(`remaster track:${search.song}`));
    params.append("type", search.types);

    const queryString = params.toString();
    const url = "https://api.spotify.com/v1/search";

    const updateUrl = `${url}?${queryString}`;
    const token = localStorage.getItem("access_token");

    const response = await spotifyAPI(updateUrl, "GET", token, null);
    console.log(response);
    setResult(response.tracks.items);
  };

  const getDeviceId = async () => {
    const token = localStorage.getItem("access_token");
    const url = "https://api.spotify.com/v1/me/player/devices";
    const response = await spotifyAPI(url, "GET", token, null);
    console.log(response.devices[0].id);
    setDeviceId(response.devices[0].id);
  };

  const handlePlay = async (song) => {
    const token = localStorage.getItem("access_token");
    const data = {
      uris: [song],
    };
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
    const play = await spotifyAPI(url, "PUT",  token,JSON.stringify(data));
    console.log(play);
  };
return (
  <div className="dashboard">
    <h1 className="dashboard-title">Dashboard</h1>
    <button className="spotify-btn" onClick={getDeviceId}> Get Device ID</button>

    <div className="search-section">
      <label>Search</label>
      <input
        name="song"
        type="text"
        value={search.song}
        onChange={handleChange}
        className="search-input"
        placeholder="Nombre de la canción"
      />

      <label>Select Types:</label>
      <select name="types" value={search.types} onChange={handleChange} className="search-select">
        {selectTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button className="spotify-btn" onClick={handleSearch}> Buscar</button>
    </div>

    <div className="results">
      {results.map((result, idx) => (
        <div className="song-card" key={idx}>
          <img className="song-img" src={result.album.images[0].url} alt="cover" />
          <div className="song-info">
            <p className="song-name">{result.name}</p>
            <p className="artist-name">{result.artists[0].name}</p>
          </div>
          <button className="play-btn" onClick={() => handlePlay(result.uri)}> Play</button>
        </div>
      ))}
    </div>
  </div>
);

};

export default Dashboard;