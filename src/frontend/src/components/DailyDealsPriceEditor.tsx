import { useState } from 'react';
import { Pencil, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUpdateProductPrice } from '@/hooks/useQueries';
import type { Product } from '../backend';

interface DailyDealsPriceEditorProps {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthorized?: boolean;
}

export function DailyDealsPriceEditor({ products, open, onOpenChange, isAuthorized = true }: DailyDealsPriceEditorProps) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const updatePriceMutation = useUpdateProductPrice();

  const handlePriceChange = (productId: bigint, value: string) => {
    setPrices(prev => ({ ...prev, [productId.toString()]: value }));
    setValidationError('');
    setSuccessMessage('');
  };

  const handleSave = async (product: Product) => {
    if (!isAuthorized) {
      setValidationError('You are not authorized to update prices');
      return;
    }

    const priceStr = prices[product.id.toString()];
    
    // Validation
    if (!priceStr || priceStr.trim() === '') {
      setValidationError('Price cannot be empty');
      return;
    }

    const priceNum = parseFloat(priceStr);
    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationError('Please enter a valid positive number');
      return;
    }

    try {
      await updatePriceMutation.mutateAsync({
        id: product.id,
        newPrice: BigInt(Math.round(priceNum))
      });
      setSuccessMessage(`Price updated successfully for ${product.name}`);
      setValidationError('');
      // Clear the input for this product
      setPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[product.id.toString()];
        return newPrices;
      });
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to update price');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Today's Deals Prices
          </DialogTitle>
          <DialogDescription>
            Update the prices for your daily products. Changes will be reflected immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isAuthorized && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You are not authorized to edit prices. Please contact the administrator.
              </AlertDescription>
            </Alert>
          )}

          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {products.map((product) => {
            const currentPrice = prices[product.id.toString()] ?? '';
            const isEditing = currentPrice !== '';
            
            return (
              <div key={product.id.toString()} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: ₹{product.price.toString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`price-${product.id}`} className="text-xs">
                      New Price (₹)
                    </Label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={product.price.toString()}
                      value={currentPrice}
                      onChange={(e) => handlePriceChange(product.id, e.target.value)}
                      className="mt-1"
                      disabled={!isAuthorized}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSave(product)}
                    disabled={!isAuthorized || !isEditing || updatePriceMutation.isPending}
                  >
                    {updatePriceMutation.isPending ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
