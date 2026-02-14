import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { BuyerProfile } from '../backend';

// Hook to fetch the caller's buyer profile
export function useGetCallerBuyerProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isSignedIn = !!identity;

  const query = useQuery<BuyerProfile | null>({
    queryKey: ['callerBuyerProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerBuyerProfile();
    },
    enabled: !!actor && !actorFetching && isSignedIn,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Hook to save the caller's buyer profile
export function useSaveCallerBuyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BuyerProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerBuyerProfile(profile);
    },
    onSuccess: () => {
      // Invalidate and refetch buyer profile after successful save
      queryClient.invalidateQueries({ queryKey: ['callerBuyerProfile'] });
    },
  });
}
