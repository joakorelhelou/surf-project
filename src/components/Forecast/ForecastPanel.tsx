import type { Spot } from '../../types';
import { useMarineData } from '../../hooks/useMarineData';
import { useTideData } from '../../hooks/useTideData';
import ConditionsCard from './ConditionsCard';
import WaveCard from './WaveCard';
import WindCard from './WindCard';
import TideCard from './TideCard';
import { t } from '../../i18n';

interface ForecastPanelProps {
  spot: Spot;
  onClose: () => void;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-8 h-8 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

export default function ForecastPanel({ spot, onClose }: ForecastPanelProps) {
  const marine = useMarineData(spot.lat, spot.lng);
  const tide = useTideData(spot.noaa_station);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{spot.name}</h2>
          <p className="text-xs text-gray-500">{spot.country}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label={t.forecast.closeLabel}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Wave section */}
        {marine.isLoading ? (
          <LoadingSpinner />
        ) : marine.isError ? (
          <ErrorMessage message={`Failed to load marine data: ${marine.error.message}`} />
        ) : marine.data ? (
          <>
            <ConditionsCard
              hourly={marine.data.hourly}
              wind={marine.data.wind}
              shoreDirection={spot.shore_direction}
            />
            <WaveCard hourly={marine.data.hourly} />
            <WindCard wind={marine.data.wind} />
          </>
        ) : null}

        {/* Tide section */}
        {spot.noaa_station === null ? (
          <TideCard predictions={null} unavailable />
        ) : tide.isLoading ? (
          <LoadingSpinner />
        ) : tide.isError ? (
          <TideCard predictions={null} unavailable />
        ) : tide.data ? (
          <TideCard predictions={tide.data.predictions} />
        ) : null}
      </div>
    </div>
  );
}
