import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import SplashScreen from './Screens/SplashScreen/SplashScreen';
import Routers from './Routes/Routers';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">    
      <div className="app__body">       
        <Routers />
      </div>
    </div>
  );
}

export default App;
