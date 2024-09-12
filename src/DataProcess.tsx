export type DataItem = {
  type: string;
  value: number;
};

export type InboundData = {
  deviceId: string;
  data: DataItem;
};

export type Thresholds = {
  upper: number;
  lower: number;
};

export type ProfileItem = {
  type: string;
  thresholds: Thresholds;
  window: number;
};

export type DeviceProfile = {
  deviceId: string;
  profiles: ProfileItem[];
};

export type DeviceState = {
  activeWindow: number; // Counts consecutive values outside the threshold
  eventCount: number; // Number of triggered events
};

export class DeviceEventProcessor {
  private deviceProfiles: Map<string, ProfileItem[]> = new Map();
  private deviceStates: Map<string, DeviceState> = new Map();

  // Simulated method to fetch device profiles
  fetchDeviceProfiles(): void {
    const profiles: DeviceProfile[] = [
      {
        deviceId: "abc",
        profiles: [
          { type: "load", thresholds: { upper: 80, lower: 20 }, window: 2 },
        ],
      },
      {
        deviceId: "xyz",
        profiles: [
          { type: "load", thresholds: { upper: 90, lower: 30 }, window: 2 },
        ],
      },
    ];

    profiles.forEach((profile) => {
      this.deviceProfiles.set(profile.deviceId, profile.profiles);
    });
  }

  // Process the inbound data stream
  processData(inboundData: InboundData[]): void {
    inboundData.forEach((data) => {
      const { deviceId, data: sensorData } = data;
      const deviceProfile = this.deviceProfiles.get(deviceId);

      if (!deviceProfile) {
        console.warn(`No profile found for device: ${deviceId}`);
        return;
      }

      const matchingProfile = deviceProfile.find(
        (profile) => profile.type === sensorData.type
      );

      if (!matchingProfile) {
        console.warn(`No matching profile for type: ${sensorData.type}`);
        return;
      }

      this.checkForAnomalies(deviceId, sensorData, matchingProfile);
    });
  }

  // Check for anomalies in the sensor data and trigger events
  private checkForAnomalies(
    deviceId: string,
    sensorData: DataItem,
    profile: ProfileItem
  ): void {
    const { thresholds, window } = profile;
    const { value } = sensorData;

    if (!this.deviceStates.has(deviceId)) {
      this.deviceStates.set(deviceId, { activeWindow: 0, eventCount: 0 });
    }

    const deviceState = this.deviceStates.get(deviceId)!;

    if (value > thresholds.upper || value < thresholds.lower) {
      deviceState.activeWindow++;
      if (deviceState.activeWindow >= window) {
        deviceState.eventCount++;
        deviceState.activeWindow = 0; // Reset the window after triggering event
        console.log(`Event triggered for device ${deviceId}`);
      }
    } else {
      deviceState.activeWindow = 0; // Reset window if the value is back within thresholds
    }
  }

  // Output the devices sorted by the number of events triggered
  getSortedEvents(): [string, number][] {
    return Array.from(this.deviceStates.entries())
      .map(([deviceId, state]) => [deviceId, state.eventCount] as [string, number])
      .sort((a, b) => b[1] - a[1]); // Sort by event count in descending order
  }
}
