/* eslint-disable */
/* eslint-env es6 */
import './App.css';
import DeviceEventsDashboard from './DisplayData'; // Import the dashboard component

/**
 * Main component for the Device Event Monitoring App.
 * It renders the DisplayData component, which shows a dashboard with device event counts.
 */
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
