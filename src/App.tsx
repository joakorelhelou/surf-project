import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SurfMap from './components/Map/SurfMap';
import ForecastPanel from './components/Forecast/ForecastPanel';
import SpotSearch from './components/SpotSearch';
import HowItWorksModal from './components/HowItWorksModal';
import type { Spot } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppInner() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    fetch('/spots.json')
      .then((r) => r.json())
      .then((data: Spot[]) => setSpots(data))
      .catch(console.error);
  }, []);

  function handleSpotSelect(spot: Spot) {
    setSelectedSpot(spot);
  }

  function handleClose() {
    setSelectedSpot(null);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Map area */}
      <div className={`relative transition-all duration-300 ${selectedSpot ? 'h-1/2 md:h-full md:flex-1' : 'flex-1'}`}>
        {/* Search overlay */}
        <div className="absolute top-3 left-3 right-3 z-[1000] md:right-auto md:w-72">
          <SpotSearch spots={spots} onSelect={handleSpotSelect} />
        </div>

        {/* Brand + info button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-ocean-700 shadow-sm border border-ocean-100 pointer-events-none">
            🏄 Surf Forecast
          </div>
          <HowItWorksModal />
        </div>

        <SurfMap
          spots={spots}
          selectedSpot={selectedSpot}
          onSpotSelect={handleSpotSelect}
        />
      </div>

      {/* Forecast Panel */}
      {selectedSpot && (
        <div className="h-1/2 md:h-full md:w-96 lg:w-[440px] overflow-hidden shrink-0 shadow-xl">
          <ForecastPanel spot={selectedSpot} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
