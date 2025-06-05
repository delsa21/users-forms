// src/assets/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { spotifyAPI } from "./api/spotifyAPI.js";

const Login = () => {
  const [form, setForm] = useState({
    firstname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogIn = async () => {
    try {
      const { email, password: inputPassword } = form;

      const url1 = `http://localhost:3000/api/users/password/${email}`;
      const userData = await spotifyAPI(url1, "GET"); 

      if (!userData?.password) {
        alert("Correo no registrado.");
        return;
      }

      const dbPassword = userData.password.toString();

      if (dbPassword !== inputPassword) {
        alert("Contraseña incorrecta.");
        return;
      }

      const url2 = `http://localhost:3000/api/users/mail/${email}`;
      const userInfo = await spotifyAPI(url2, "GET");

      console.log("Respuesta del backend:", userInfo);

      if (userInfo?.id) {
        localStorage.setItem("UserId", userInfo.id.toString());
        console.log("Usuario válido..");
        navigate("/");
      } else {
        alert("No se pudo completar el inicio de sesión.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Login</h1>

      <div className="container-sub">
        <span className="dashboard-subtitle">¿Aún no tienes cuenta?</span>
        <Link className="link-text" to="/register">
          Regístrate
        </Link>
      </div>

      <form
        className="search-section"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogIn();
        }}
      >
        <label className="form-label">
          Nombre:
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="search-input"
            placeholder="Ingresa tu nombre"
          />
        </label>

        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="search-input"
            placeholder="Ingresa tu correo"
            required
          />
        </label>

        <label className="form-label">
          Contraseña:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="search-input"
            placeholder="Ingresa tu contraseña"
            required
          />
        </label>

        <button type="submit" className="spotify-btn">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
