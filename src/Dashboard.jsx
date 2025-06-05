// src/Dashboard.jsx
import React, { useState, useEffect } from "react";
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

  const [results, setResults] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  const userId = localStorage.getItem("UserId");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (refreshFavorites) handleGetFavorites();
  }, [refreshFavorites]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      if (!search.song || !search.types) {
        alert("Debes escribir una canción y seleccionar un tipo.");
        return;
      }

      const params = new URLSearchParams();
      params.append("q", search.song);
      params.append("type", search.types);

      const url = `https://api.spotify.com/v1/search?${params.toString()}`;
      console.log("URL final:", url);

      if (!token) {
        alert("No tienes token. Inicia sesión primero.");
        return;
      }

      const response = await spotifyAPI(url, "GET", token, null);
      console.log("Respuesta Spotify:", response);

      if (response?.tracks?.items?.length > 0) {
        setResults(response.tracks.items);
      } else {
        alert("No se encontraron resultados.");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error.message);
    }
  };

  const getDeviceId = async () => {
    try {
      const url = "https://api.spotify.com/v1/me/player/devices";
      const response = await spotifyAPI(url, "GET", token, null);

      if (response?.devices?.length > 0) {
        setDeviceId(response.devices[0].id);
      } else {
        alert("No se detectó un dispositivo activo.");
      }
    } catch (error) {
      console.error("Error al obtener device ID:", error.message);
    }
  };

  const handlePlay = async (songUri) => {
    try {
      if (!deviceId) {
        alert("Primero obtén el Device ID.");
        return;
      }

      const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      const data = {
        uris: [songUri],
      };

      await spotifyAPI(url, "PUT", token, JSON.stringify(data));
    } catch (error) {
      console.error("Error al reproducir:", error.message);
    }
  };

  const handleAddFavorite = (song) => {
    const exists = favorites.some((fav) => fav.id === song.id);
    setFavorites((prev) =>
      exists ? prev.filter((f) => f.id !== song.id) : [...prev, song]
    );
  };

  const saveFavorites = async () => {
    try {
      const url = `http://localhost:3000/api/users/${userId}/favorites`;
      const data = { items: favorites };
      await spotifyAPI(url, "POST", data, null);
      setRefreshFavorites((prev) => !prev);
    } catch (error) {
      console.error("Error al guardar favoritos:", error.message);
    }
  };

  const handleGetFavorites = async () => {
    try {
      const url = `http://localhost:3000/api/users/${userId}/favorites`;
      const result = await spotifyAPI(url, "GET", null, null);
      setFavoritesList(result || []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error.message);
    }
  };

  const handleDeleteFavorite = async (favorite) => {
    try {
      const url = `http://localhost:3000/api/users/${userId}/favorites/delete`;
      await spotifyAPI(url, "DELETE", favorite, null);
      setRefreshFavorites((prev) => !prev);
    } catch (error) {
      console.error("Error al eliminar favorito:", error.message);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <button className="spotify-btn" onClick={getDeviceId}>
        Obtener Device ID
      </button>

      <div className="search-section">
        <label>Buscar canción:</label>
        <input
          name="song"
          type="text"
          value={search.song}
          onChange={handleChange}
          className="search-input"
          placeholder="Nombre de la canción"
        />

        <label>Selecciona tipo:</label>
        <select
          name="types"
          value={search.types}
          onChange={handleChange}
          className="search-select"
        >
          <option value="">--Selecciona--</option>
          {selectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button className="spotify-btn" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      <div className="results">
        {results.map((result) => (
          <div className="song-card" key={result.id}>
            <img
              className="song-img"
              src={result.album?.images?.[0]?.url}
              alt="cover"
            />
            <div className="song-info">
              <p className="song-name">{result.name}</p>
              <p className="artist-name">{result.artists[0].name}</p>
            </div>
            <button className="play-btn" onClick={() => handlePlay(result.uri)}>
              Reproducir
            </button>
            <button
              className="fav-btn"
              onClick={() => handleAddFavorite(result)}
              style={{
                fontSize: "1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {favorites.some((f) => f.id === result.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>Favoritos seleccionados</h2>
          <button className="spotify-btn" onClick={saveFavorites}>
            Guardar favoritos
          </button>
        </div>
      )}

      {favoritesList.length > 0 && (
        <div className="saved-favorites">
          <h2>Mis Favoritos</h2>
          {favoritesList.map((fav) => (
            <div key={fav.id} className="song-card">
              <p>
                {fav.name} - {fav.artist}
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDeleteFavorite(fav)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
