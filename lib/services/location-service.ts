import { SolarTime } from 'tyme4ts';

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    displayName: string;
}

export async function getLocationCoordinates(city: string): Promise<LocationCoordinates | null> {
    if (!city) return null;

    try {
        // Add 5 second timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': '52Baizi/1.0',
                },
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Location service unavailable');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching location coordinates:', error);
        // Return null to trigger fallback to default longitude (120°E)
        return null;
    }
}

/**
 * Calculates True Solar Time
 * Formula: True Solar Time = Standard Time + (Longitude - 120) * 4 minutes
 * Beijing Time is UTC+8, based on 120°E.
 */
export function calculateTrueSolarTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    longitude: number
): { year: number; month: number; day: number; hour: number; minute: number } {
    // Standard meridian for Beijing Time is 120 degrees
    const standardLongitude = 120;

    // Time difference in minutes
    // 1 degree = 4 minutes
    const timeDiffMinutes = (longitude - standardLongitude) * 4;

    // Create date object for calculation (using UTC methods to avoid local timezone mess, 
    // but here inputs are Beijing Time, so we can just manipulate minutes)
    const totalMinutes = hour * 60 + minute + timeDiffMinutes;

    // Normalize
    let newTotalMinutes = totalMinutes;
    let dayOffset = 0;

    while (newTotalMinutes < 0) {
        newTotalMinutes += 24 * 60;
        dayOffset -= 1;
    }

    while (newTotalMinutes >= 24 * 60) {
        newTotalMinutes -= 24 * 60;
        dayOffset += 1;
    }

    const newHour = Math.floor(newTotalMinutes / 60);
    const newMinute = Math.floor(newTotalMinutes % 60);

    // Handle date change
    // Tym4ts SolarTime or JS Date can handle this. 
    // Let's use JS Date for rolling the date.
    // Note: Month in JS Date is 0-11.
    const date = new Date(year, month - 1, day, hour, minute);
    // Add time difference in milliseconds
    date.setMinutes(date.getMinutes() + timeDiffMinutes);

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
    };
}
