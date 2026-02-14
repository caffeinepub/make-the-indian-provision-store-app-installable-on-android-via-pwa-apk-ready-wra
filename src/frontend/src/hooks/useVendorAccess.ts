import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole } from '../backend';

export function useVendorAccess() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isSignedIn = !!identity;

  const roleQuery = useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && isSignedIn,
    retry: false,
  });

  const isCheckingAuth = actorFetching || (isSignedIn && roleQuery.isLoading);
  const isVendor = isSignedIn && roleQuery.data === UserRole.user;
  const isAdmin = isSignedIn && roleQuery.data === UserRole.admin;
  const isAuthorized = isVendor || isAdmin;
  const isGuest = !isSignedIn || roleQuery.data === UserRole.guest;

  return {
    isSignedIn,
    isCheckingAuth,
    isVendor,
    isAdmin,
    isAuthorized,
    isGuest,
    role: roleQuery.data,
  };
}
