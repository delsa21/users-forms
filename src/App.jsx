import { useNavigate } from 'react-router-dom';
import './App.css';
import { getToken } from './getToken';
import { getDataAuth, authFlow } from "./setup";
import { useEffect } from 'react';
import { spotifyAPI } from './api/spotifyAPI';

function App() {
  const navigate = useNavigate();

  const handleSetup = async () => {
    const code = await getDataAuth();
    authFlow(code);
  };

  const handleGetToken = () => {
    getToken();
    navigate('/dashboard');
  };

  const getUsers = async () => {
    const url = "http://localhost:3000/api/users";
    const res = await spotifyAPI(url, 'GET', null);
    console.log(res);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("UserId");
      navigate("/login");
  }, [navigate]);

  return (
    <div className="app-container">
      <h1>Hola Mund34</h1>
      <button onClick={handleSetup}>Start Setup</button>
      <button onClick={handleGetToken}>Get Token</button>
    </div>
  );
}

export default App;
