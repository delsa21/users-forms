// src/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyAPI } from "./api/spotifyAPI.js";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRegistro = async () => {
    const url = "http://localhost:3000/api/users";

    try {
      const res = await spotifyAPI(url, "POST", null, form);
      console.log("Respuesta backend:", res);

      if (res?.id) {
        localStorage.setItem("UserId", res.id.toString());
        navigate("/");
      } else {
        alert("No se pudo registrar. Revisa tus datos.");
      }
    } catch (error) {
      console.error("Error en el registro:", error.message);
      alert("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="dashboard" style={{ maxWidth: "400px", margin: "auto" }}>
      <h1 className="dashboard-title">Regístrate</h1>

      <form
        className="search-section"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegistro();
        }}
      >
        <label htmlFor="firstname" className="form-label">
          Nombre:
          <input
            id="firstname"
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="search-input"
            placeholder="Tu nombre"
            required
          />
        </label>

        <label htmlFor="email" className="form-label">
          Correo:
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="search-input"
            placeholder="Tu correo"
            required
          />
        </label>

        <label htmlFor="password" className="form-label">
          Contraseña:
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="search-input"
            placeholder="Tu contraseña"
            required
          />
        </label>

        <button type="submit" className="spotify-btn">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
