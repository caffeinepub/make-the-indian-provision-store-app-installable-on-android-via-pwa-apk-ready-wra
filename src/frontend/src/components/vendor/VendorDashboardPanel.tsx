import { useState } from 'react';
import { Package, Plus, AlertCircle, CheckCircle2, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddProduct } from '@/hooks/useQueries';
import { useVendorAccess } from '@/hooks/useVendorAccess';
import { PRODUCT_CATEGORIES } from '@/constants/productCategories';
import { ProductCategory } from '@/backend';

interface VendorDashboardPanelProps {
  onEditPrices: () => void;
}

export function VendorDashboardPanel({ onEditPrices }: VendorDashboardPanelProps) {
  const { isSignedIn, isCheckingAuth, isAuthorized, isAdmin, isVendor } = useVendorAccess();
  const addProductMutation = useAddProduct();

  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState<ProductCategory | ''>('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    // Validation
    if (!productId.trim() || !productName.trim() || !productPrice.trim()) {
      setValidationError('All fields are required');
      return;
    }

    if (!productCategory) {
      setValidationError('Please select a category');
      return;
    }

    const idNum = parseInt(productId);
    const priceNum = parseFloat(productPrice);

    if (isNaN(idNum) || idNum <= 0) {
      setValidationError('Product ID must be a positive number');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationError('Price must be a positive number');
      return;
    }

    try {
      await addProductMutation.mutateAsync({
        id: BigInt(idNum),
        name: productName.trim(),
        price: BigInt(Math.round(priceNum)),
        category: productCategory,
      });
      setSuccessMessage(`Product "${productName}" added successfully!`);
      // Clear form
      setProductId('');
      setProductName('');
      setProductPrice('');
      setProductCategory('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to add product');
    }
  };

  // Show authorization status header
  const renderAuthStatus = () => {
    if (!isSignedIn) {
      return (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in using the Vendor Login button above to access vendor features.
          </AlertDescription>
        </Alert>
      );
    }

    if (isCheckingAuth) {
      return (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Checking authorization...
          </AlertDescription>
        </Alert>
      );
    }

    if (!isAuthorized) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not authorized as a vendor. Please contact the admin to request vendor access.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-foreground">Authorized as</span>
        {isAdmin && (
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )}
        {isVendor && (
          <Badge variant="secondary" className="gap-1">
            <User className="h-3 w-3" />
            Vendor
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderAuthStatus()}

      {/* Add Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </CardTitle>
          <CardDescription>
            Add products to your store inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                type="number"
                placeholder="e.g., 1"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                disabled={!isAuthorized || addProductMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                type="text"
                placeholder="e.g., Basmati Rice 1kg"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={!isAuthorized || addProductMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Price (₹)</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 120"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                disabled={!isAuthorized || addProductMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Select
                value={productCategory}
                onValueChange={(value) => setProductCategory(value as ProductCategory)}
                disabled={!isAuthorized || addProductMutation.isPending}
              >
                <SelectTrigger id="productCategory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-600 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isAuthorized || addProductMutation.isPending}
            >
              {addProductMutation.isPending ? (
                <>
                  <Package className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onEditPrices}
            disabled={!isAuthorized}
          >
            <Package className="mr-2 h-4 w-4" />
            Edit Product Prices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
