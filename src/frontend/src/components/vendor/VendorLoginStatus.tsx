import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function VendorLoginStatus() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && identity && (
        <div className="hidden sm:block text-xs text-muted-foreground">
          <span className="font-mono">{identity.getPrincipal().toString().slice(0, 8)}...</span>
        </div>
      )}
      <Button
        onClick={handleAuth}
        disabled={isLoggingIn}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : isAuthenticated ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Vendor Login
          </>
        )}
      </Button>
    </div>
  );
}
