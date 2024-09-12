/**
 * Represents a single data item from a device, with a type and a value.
 */
export type DataItem = {
  type: string; // The type of data (e.g., load, temperature)
  value: number; // The value associated with the data type
};

/**
 * Represents the inbound data from a device, consisting of a deviceId and the actual data.
 */
export type InboundData = {
  deviceId: string; // Unique identifier for the device
  data: DataItem; // The actual data item for this device
};

/**
 * Defines upper and lower thresholds for a given type of data.
 */
export type Thresholds = {
  upper: number; // Upper threshold value
  lower: number; // Lower threshold value
};

/**
 * Represents the profile for a particular type of data, including thresholds and the window size.
 */
export type ProfileItem = {
  type: string; // The type of data (e.g., load, temperature)
  thresholds: Thresholds; // Thresholds for the type of data
  window: number;   // The number of consecutive values that must exceed the threshold to trigger an event
};

/**
 * Represents the profile of a device, including its deviceId and a list of profile items.
 */
export type DeviceProfile = {
  deviceId: string; // Unique identifier for the device
  profiles: ProfileItem[]; // List of profile items for this device
};

/**
 * Represents the current state of a device, including active window count and event count.
 */
export type DeviceState = {
  activeWindow: number; // Counts consecutive values outside the threshold
  eventCount: number; // Number of triggered events
};
/**
 * Class responsible for processing device data, checking for anomalies, and tracking event counts.
 */
export class DeviceEventProcessor {
  private deviceProfiles: Map<string, ProfileItem[]> = new Map();
  private deviceStates: Map<string, DeviceState> = new Map();

  /**
   * Simulates the fetching of device profiles from an external source (e.g., server).
   * This method initializes device profiles with thresholds and windows.
   */
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

  /**
   * Processes the incoming data for multiple devices, checking against the profiles
   * to see if any thresholds are exceeded and updating device states accordingly.
   *
   * @param inboundData - Array of data points from devices
   */
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

  /**
   * Checks if the data from the sensor exceeds the thresholds for a given profile.
   * If the data exceeds the thresholds for a consecutive number of times (based on the window),
   * an event is triggered and the event count is incremented.
   *
   * @param deviceId - Unique identifier for the device
   * @param sensorData - Data from the device's sensor
   * @param profile - The profile containing thresholds and window size
   */
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

  /**
   * Returns a sorted list of device IDs and their event counts in descending order
   * based on the number of events triggered.
   *
   * @returns Array of tuples with deviceId and eventCount
   */
  getSortedEvents(): [string, number][] {
    return Array.from(this.deviceStates.entries())
      .map(([deviceId, state]) => [deviceId, state.eventCount] as [string, number])
      .sort((a, b) => b[1] - a[1]); // Sort by event count in descending order
  }
}
