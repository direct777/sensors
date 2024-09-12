/* eslint-disable */
/* eslint-env es6 */
import React from 'react';
import './App.css';
import DeviceEventsDashboard from './DisplayData.tsx'; // Import your component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Device Event Monitoring App</h1>
      </header>
      <main>
        <DeviceEventsDashboard /> {/* Render the dashboard component */}
      </main>
    </div>
  );
}

export default App;
