import React, { useState, useEffect } from 'react';
import { DeviceEventProcessor, InboundData } from './DataProcess';

/**
 * Component that displays a table of devices and the number of events they have triggered.
 * It simulates incoming data from devices, processes it through DeviceEventProcessor, and
 * displays the results in a dashboard format.
 */
const DisplayData: React.FC = () => {
  // Simulated inbound data for devices (this could be dynamic in real applications)
  const inboundData: InboundData[] = [
    { deviceId: "abc", data: { type: "load", value: 85 } },
    { deviceId: "abc", data: { type: "load", value: 90 } },
    { deviceId: "xyz", data: { type: "load", value: 95 } },
    { deviceId: "xyz", data: { type: "load", value: 85 } },
    { deviceId: "abc", data: { type: "load", value: 50 } },
    { deviceId: "abc", data: { type: "load", value: 15 } },
    { deviceId: "abc", data: { type: "load", value: 90 } },
  ];

  // State to store the sorted event counts for devices
  const [sortedEvents, setSortedEvents] = useState<[string, number][]>([]);

  useEffect(() => {
    // Initialize the processor, fetch profiles, process data, and set the sorted event counts
    const processor = new DeviceEventProcessor();
    processor.fetchDeviceProfiles();
    processor.processData(inboundData);
    const events = processor.getSortedEvents();
    setSortedEvents(events);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Device Events Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Device ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Event Count</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.length > 0 ? (
            sortedEvents.map(([deviceId, count]) => (
              <tr key={deviceId}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{deviceId}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                No events detected
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayData;