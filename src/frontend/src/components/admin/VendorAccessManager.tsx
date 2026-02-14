import { useState } from 'react';
import { UserPlus, UserMinus, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAssignVendor, useRemoveVendor } from '@/hooks/useQueries';
import { Principal } from '@dfinity/principal';

export function VendorAccessManager() {
  const assignVendorMutation = useAssignVendor();
  const removeVendorMutation = useRemoveVendor();

  const [principalId, setPrincipalId] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validatePrincipal = (id: string): Principal | null => {
    try {
      return Principal.fromText(id.trim());
    } catch {
      return null;
    }
  };

  const handleAssignVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!principalId.trim()) {
      setValidationError('Principal ID is required');
      return;
    }

    const principal = validatePrincipal(principalId);
    if (!principal) {
      setValidationError('Invalid Principal ID format. Please check and try again.');
      return;
    }

    try {
      await assignVendorMutation.mutateAsync(principal);
      setSuccessMessage(`Vendor access granted successfully to ${principalId.substring(0, 10)}...`);
      setPrincipalId('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to assign vendor access');
    }
  };

  const handleRemoveVendor = async () => {
    setValidationError('');
    setSuccessMessage('');

    if (!principalId.trim()) {
      setValidationError('Principal ID is required');
      return;
    }

    const principal = validatePrincipal(principalId);
    if (!principal) {
      setValidationError('Invalid Principal ID format. Please check and try again.');
      return;
    }

    try {
      await removeVendorMutation.mutateAsync(principal);
      setSuccessMessage(`Vendor access removed successfully from ${principalId.substring(0, 10)}...`);
      setPrincipalId('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to remove vendor access');
    }
  };

  const isLoading = assignVendorMutation.isPending || removeVendorMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Vendor Access Management
        </CardTitle>
        <CardDescription>
          Grant or revoke vendor permissions for users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssignVendor} className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="principalId">Principal ID</Label>
            <Input
              id="principalId"
              type="text"
              placeholder="e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the Principal ID of the user you want to manage
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !principalId.trim()}
            >
              {assignVendorMutation.isPending ? (
                <>Assigning...</>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Vendor
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleRemoveVendor}
              disabled={isLoading || !principalId.trim()}
            >
              {removeVendorMutation.isPending ? (
                <>Removing...</>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Remove Vendor
                </>
              )}
            </Button>
          </div>
        </form>

        <Separator className="my-6" />

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How to get a Principal ID:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Ask the user to sign in using the Vendor Login button</li>
            <li>The user's Principal ID will be displayed after login</li>
            <li>Copy the Principal ID and paste it above</li>
            <li>Click "Assign Vendor" to grant access</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
