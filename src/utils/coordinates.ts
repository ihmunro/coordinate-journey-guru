
export interface Coordinate {
  lat: number;
  lng: number;
}

export type Direction = 'North' | 'South' | 'East' | 'West';

export const validateCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const parseCoordinates = (input: string): Coordinate[] => {
  const coordinates: Coordinate[] = [];
  
  // Remove any whitespace and split by commas
  const cleanInput = input.replace(/\s+/g, ' ').trim();
  
  // Try to parse as Google Maps format first (e.g., "51.5074° N, 0.1278° W" or "51.5074, -0.1278")
  const googleMapsPattern = /(-?\d+\.?\d*)\s*°?\s*[NS]?,\s*(-?\d+\.?\d*)\s*°?\s*[EW]?/gi;
  const matches = [...cleanInput.matchAll(googleMapsPattern)];
  
  if (matches.length > 0) {
    // Process Google Maps format
    matches.forEach(match => {
      let lat = parseFloat(match[1]);
      let lng = parseFloat(match[2]);
      
      // Handle directional indicators if present
      if (match[0].includes('S')) lat = -lat;
      if (match[0].includes('W')) lng = -lng;
      
      if (isNaN(lat) || isNaN(lng) || !validateCoordinate(lat, lng)) {
        throw new Error(`Invalid coordinates: ${match[0]}`);
      }
      
      coordinates.push({ lat, lng });
    });
  } else {
    // Process simple comma-separated format
    const pairs = cleanInput.split(',').map(pair => pair.trim());
    
    for (let i = 0; i < pairs.length; i += 2) {
      const lat = parseFloat(pairs[i]);
      const lng = parseFloat(pairs[i + 1]);
      
      if (isNaN(lat) || isNaN(lng) || !validateCoordinate(lat, lng)) {
        throw new Error(`Invalid coordinates at position ${i + 1}`);
      }
      
      coordinates.push({ lat, lng });
    }
  }
  
  return coordinates;
};

export const sortCoordinates = (coordinates: Coordinate[], direction: Direction): Coordinate[] => {
  return [...coordinates].sort((a, b) => {
    switch (direction) {
      case 'North':
        return b.lat - a.lat;
      case 'South':
        return a.lat - b.lat;
      case 'East':
        return b.lng - a.lng;
      case 'West':
        return a.lng - b.lng;
      default:
        return 0;
    }
  });
};

export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateTime = (distance: number): number => {
  const averageSpeed = 60; // km/h
  return distance / averageSpeed;
};

export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(2)} km`;
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes}m`;
};
