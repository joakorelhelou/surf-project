import { useQuery } from '@tanstack/react-query';
import { fetchMarineData } from '../api/openMeteo';
import type { MarineData } from '../types';

export function useMarineData(lat: number | null, lng: number | null) {
  return useQuery<MarineData, Error>({
    queryKey: ['marine', lat, lng],
    queryFn: () => fetchMarineData(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
}
