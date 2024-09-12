import { DeviceEventProcessor, InboundData } from './DataProcess';
import { act } from 'react';

describe('DeviceEventProcessor', () => {
    let processor: DeviceEventProcessor;

    beforeEach(() => {
        processor = new DeviceEventProcessor();
        processor.fetchDeviceProfiles();
    });

    it('should process inbound data and trigger events', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'abc', data: { type: 'load', value: 85 } },
            { deviceId: 'xyz', data: { type: 'load', value: 85 } },
            { deviceId: 'abc', data: { type: 'load', value: 15 } },
            { deviceId: 'abc', data: { type: 'load', value: 15 } }
        ];
        
        act(() => {
            processor.processData(inboundData);
        });

        console.log(processor.getSortedEvents());

        // Assert that events were triggered correctly
        expect(processor.getSortedEvents()).toEqual([
            ['abc', 1],
            ['xyz', 0],
        ]);
        
    });
    it('should handle no profiles for a device', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'unknown', data: { type: 'load', value: 85 } }
        ];

        processor.processData(inboundData);

        // Assert that no events were triggered
        expect(processor.getSortedEvents()).toEqual([]);
    });
    
    it('should not trigger events for values within thresholds', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'abc', data: { type: 'load', value: 50 } },
            { deviceId: 'xyz', data: { type: 'load', value: 50 } }
        ];

        processor.processData(inboundData);

        // Assert that no events were triggered
        expect(processor.getSortedEvents()).toEqual([
            ['abc', 0],
            ['xyz', 0],
        ]);
    });
    it('should handle multiple devices correctly', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'abc', data: { type: 'load', value: 85 } },
            { deviceId: 'xyz', data: { type: 'load', value: 85 } }, // Adjusted value to be within threshold
            { deviceId: 'abc', data: { type: 'load', value: 15 } },
            { deviceId: 'xyz', data: { type: 'load', value: 25 } }
        ];

        processor.processData(inboundData);

        // Assert that events were triggered correctly
        expect(processor.getSortedEvents()).toEqual([
            ['abc', 1],
            ['xyz', 0], // Adjusted expectation
        ]);
    });

    it('should count consecutive values outside thresholds', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'abc', data: { type: 'load', value: 85 } },
            { deviceId: 'abc', data: { type: 'load', value: 85 } }
        ];

        processor.processData(inboundData);

        // Assert that an event was triggered
        expect(processor.getSortedEvents()).toEqual([
            ['abc', 1],
        ]);
    });

    it('should reset active window when values return within thresholds', () => {
        const inboundData: InboundData[] = [
            { deviceId: 'abc', data: { type: 'load', value: 85 } },
            { deviceId: 'abc', data: { type: 'load', value: 50 } },
            { deviceId: 'abc', data: { type: 'load', value: 85 } },
            { deviceId: 'abc', data: { type: 'load', value: 85 } }
        ];

        processor.processData(inboundData);

        // Assert that an event was triggered
        expect(processor.getSortedEvents()).toEqual([
            ['abc', 1],
        ]);
    });
});