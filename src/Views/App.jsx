import React from 'react';
import WavyBackground from '../Components/WavyBackground';
import Navbar from '../Components/Navbar';
import MiddlePart from '../Components/MiddlePart';

function App() {
  
  return (
    <div className='h-screen dark:bg-gray-800 dark:bg-opacity-90'>
        <Navbar />
        <WavyBackground />
        <MiddlePart />
    </div>
  );
}

export default App;
