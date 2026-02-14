import { useState, useEffect } from 'react';
import { getPersistedUrlParameter, storeSessionParameter, clearSessionParameter } from '@/utils/urlParams';

/**
 * Hook to manage vendor-only mode via URL parameter and session persistence.
 * When vendor=1 is present in the URL, vendor mode is enabled for the session.
 * This gates vendor-only UI elements from normal buyer browsing.
 */
export function useVendorMode() {
  const [isVendorModeEnabled, setIsVendorModeEnabled] = useState(false);

  const checkVendorMode = () => {
    // Use the persisted URL parameter utility that handles both standard and hash-based routing
    const vendorParam = getPersistedUrlParameter('vendor', 'vendorMode');
    setIsVendorModeEnabled(vendorParam === '1');
  };

  useEffect(() => {
    // Check vendor mode on mount
    checkVendorMode();

    // Listen for hash changes (for hash-based routing)
    const handleHashChange = () => {
      checkVendorMode();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const enableVendorMode = () => {
    storeSessionParameter('vendorMode', '1');
    setIsVendorModeEnabled(true);
  };

  const disableVendorMode = () => {
    clearSessionParameter('vendorMode');
    setIsVendorModeEnabled(false);
  };

  return { 
    isVendorModeEnabled,
    enableVendorMode,
    disableVendorMode
  };
}
