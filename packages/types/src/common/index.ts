export interface Address {
  id: string;
  label: string | null;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Location {
  label: string | null;
  coordinates: [number, number];
}

export interface Coordinates {
  lat: number;
  lng: number;
}
