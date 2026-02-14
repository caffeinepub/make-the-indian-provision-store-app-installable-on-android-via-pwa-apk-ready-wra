import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, UserRole, BuyerProfile, ProductCategory } from '../backend';
import type { Principal } from '@dfinity/principal';
import { normalizeActorError } from '../utils/actorErrors';

// Hook to fetch all products (daily deals)
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Hook to fetch caller's user role for authorization
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Hook to add a new product (vendor only)
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, price, category }: { id: bigint; name: string; price: bigint; category: ProductCategory }) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        await actor.addProduct(id, name, price, category);
      } catch (error) {
        throw new Error(normalizeActorError(error));
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products after successful add
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Hook to update a product's price
export function useUpdateProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newPrice }: { id: bigint; newPrice: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        await actor.updateProductPrice(id, newPrice);
      } catch (error) {
        throw new Error(normalizeActorError(error));
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products after successful update
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Hook to assign vendor permissions (admin only)
export function useAssignVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        await actor.assignVendor(principal);
      } catch (error) {
        throw new Error(normalizeActorError(error));
      }
    },
    onSuccess: () => {
      // Invalidate role queries to reflect the change
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

// Hook to remove vendor permissions (admin only)
export function useRemoveVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        await actor.removeVendor(principal);
      } catch (error) {
        throw new Error(normalizeActorError(error));
      }
    },
    onSuccess: () => {
      // Invalidate role queries to reflect the change
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

// Hook to fetch caller's buyer profile
export function useGetCallerBuyerProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<BuyerProfile | null>({
    queryKey: ['currentBuyerProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerBuyerProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Hook to save caller's buyer profile
export function useSaveCallerBuyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BuyerProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerBuyerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentBuyerProfile'] });
    },
  });
}
