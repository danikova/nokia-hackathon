import { sw } from '@/lib/utils';
import { pb } from './client';
import { InfoCardRecord } from './infoCards.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useInfoCards(
  options?: Partial<UseQueryOptions<InfoCardRecord[], Error>>
) {
  return useQuery({
    queryKey: ['infoCards'],
    queryFn: async () =>
      await sw(pb.collection('info_cards').getFullList<InfoCardRecord>()),
    ...options,
  });
}
