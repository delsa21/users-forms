import { useNavigate } from 'react-router-dom';
import './App.css';
import { getToken } from './getToken';
import { getDataAuth, authFlow } from "./setup";

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

  return (
    <div className="app-container">
      <h1>Hola Mund34</h1>
      <button onClick={handleSetup}>Start Setup</button>
      <button onClick={handleGetToken}>Get Token</button>
    </div>
  );
}

export default App;
