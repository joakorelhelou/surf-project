import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Spot } from '../../types';

// Custom wave icon
const waveIcon = L.divIcon({
  className: '',
  html: `<div class="w-8 h-8 rounded-full bg-ocean-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-ocean-600 transition-colors" style="width:32px;height:32px;border-radius:50%;background:#0ea5e9;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;">🏄</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const waveIconSelected = L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;border-radius:50%;background:#0369a1;border:3px solid #38bdf8;box-shadow:0 2px 12px rgba(14,165,233,0.6);display:flex;align-items:center;justify-content:center;cursor:pointer;">🏄</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface SpotMarkerProps {
  spot: Spot;
  isSelected: boolean;
  onClick: (spot: Spot) => void;
}

export default function SpotMarker({ spot, isSelected, onClick }: SpotMarkerProps) {
  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={isSelected ? waveIconSelected : waveIcon}
      eventHandlers={{ click: () => onClick(spot) }}
    >
      <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
        <div className="text-sm font-semibold">{spot.name}</div>
        <div className="text-xs text-gray-500">{spot.country}</div>
      </Tooltip>
    </Marker>
  );
}
