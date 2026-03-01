import { useQuery } from '@tanstack/react-query';
import { fetchTideData } from '../api/noaa';
import type { TideData } from '../types';

export function useTideData(stationId: string | null) {
  return useQuery<TideData, Error>({
    queryKey: ['tide', stationId],
    queryFn: () => fetchTideData(stationId!),
    enabled: stationId !== null,
    staleTime: 1000 * 60 * 60, // 1 hour (tides change slowly)
    retry: 2,
  });
}
