import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import SpotMarker from './SpotMarker';
import type { Spot } from '../../types';

/** Flies to the user's geolocation once on mount. Silent no-op if denied. */
function FlyToUserLocation() {
  const map = useMap();

  useEffect(() => {
    const fly = (lat: number, lng: number) =>
      map.flyTo([lat, lng], 8, { duration: 1.5 });

    if (Capacitor.isNativePlatform()) {
      // On Android/iOS: use the Capacitor plugin so the OS permission dialog fires correctly.
      Geolocation.getCurrentPosition({ timeout: 8000, enableHighAccuracy: false })
        .then(({ coords }) => fly(coords.latitude, coords.longitude))
        .catch(() => {});
    } else {
      // On web: use the browser API directly (no plugin bridge needed).
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fly(coords.latitude, coords.longitude),
        () => {},
        { timeout: 8000 }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  return null;
}

interface FlyToSpotProps {
  spot: Spot | null;
}

function FlyToSpot({ spot }: FlyToSpotProps) {
  const map = useMap();
  const prevSpotId = useRef<string | null>(null);

  useEffect(() => {
    if (spot && spot.id !== prevSpotId.current) {
      map.flyTo([spot.lat, spot.lng], 12, { duration: 1.2 });
      prevSpotId.current = spot.id;
    }
  }, [spot, map]);

  return null;
}

interface SurfMapProps {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSpotSelect: (spot: Spot) => void;
}

export default function SurfMap({ spots, selectedSpot, onSpotSelect }: SurfMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => (
        <SpotMarker
          key={spot.id}
          spot={spot}
          isSelected={selectedSpot?.id === spot.id}
          onClick={onSpotSelect}
        />
      ))}
      <FlyToUserLocation />
      <FlyToSpot spot={selectedSpot} />
    </MapContainer>
  );
}
