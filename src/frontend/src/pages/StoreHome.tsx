import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Clock, MapPin, Phone, Heart, Pencil, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllProducts } from '@/hooks/useQueries';
import { useVendorAccess } from '@/hooks/useVendorAccess';
import { useVendorMode } from '@/hooks/useVendorMode';
import { DailyDealsPriceEditor } from '@/components/DailyDealsPriceEditor';
import { VendorLoginStatus } from '@/components/vendor/VendorLoginStatus';
import { BuyerLoginStatus } from '@/components/buyer/BuyerLoginStatus';
import { VendorDashboardPanel } from '@/components/vendor/VendorDashboardPanel';
import { VendorAccessManager } from '@/components/admin/VendorAccessManager';
import { PRODUCT_CATEGORIES } from '@/constants/productCategories';

export function StoreHome() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const { data: products, isLoading, isError, error } = useGetAllProducts();
  const { isAuthorized, isAdmin } = useVendorAccess();
  const { isVendorModeEnabled, enableVendorMode, disableVendorMode } = useVendorMode();

  // Force close vendor dialogs when vendor mode is disabled
  useEffect(() => {
    if (!isVendorModeEnabled) {
      setEditorOpen(false);
      setDashboardOpen(false);
    }
  }, [isVendorModeEnabled]);

  // Map product icons (fallback to emoji based on name)
  const getProductIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('rice')) return '🌾';
    if (lowerName.includes('dal') || lowerName.includes('lentil')) return '🫘';
    if (lowerName.includes('atta') || lowerName.includes('flour')) return '🌾';
    if (lowerName.includes('oil')) return '🛢️';
    if (lowerName.includes('sugar')) return '🍬';
    if (lowerName.includes('salt')) return '🧂';
    if (lowerName.includes('tea') || lowerName.includes('coffee')) return '☕';
    return '📦';
  };

  const handleOpenPriceEditor = () => {
    setDashboardOpen(false);
    setEditorOpen(true);
  };

  const handleEnableVendorMode = () => {
    enableVendorMode();
    // Scroll to top to show the vendor login button
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDisableVendorMode = () => {
    disableVendorMode();
  };

  // Show vendor controls only when vendor mode is enabled AND user is authorized
  const showVendorControls = isVendorModeEnabled && isAuthorized;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-2xl">
              🏪
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-foreground">Provision Store</h1>
              <p className="text-xs text-muted-foreground">Your Daily Needs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BuyerLoginStatus />
            {isVendorModeEnabled && <VendorLoginStatus />}
            <Button size="icon" variant="ghost">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8">
          <div className="container px-4">
            <div className="flex flex-col gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  <Clock className="mr-1 h-3 w-3" />
                  Open Now
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Fresh & Quality Products
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Get all your daily essentials delivered to your doorstep
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">2.5 km away</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b py-6">
          <div className="container px-4">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Shop by Category</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
              {PRODUCT_CATEGORIES.map((category) => (
                <Card
                  key={category.value}
                  className="cursor-pointer transition-all hover:shadow-md active:scale-95"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-2 text-3xl">{category.icon}</div>
                    <p className="text-xs font-medium text-foreground">{category.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products / Today's Deals */}
        <section className="py-6">
          <div className="container px-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Today's Deals</h3>
              <div className="flex gap-2">
                {showVendorControls && (
                  <>
                    <Sheet open={dashboardOpen} onOpenChange={setDashboardOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Vendor Panel</span>
                          <span className="sm:hidden">Panel</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Vendor Dashboard</SheetTitle>
                          <SheetDescription>
                            Manage your products and permissions
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          {isAdmin ? (
                            <Tabs defaultValue="products" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="access">Access</TabsTrigger>
                              </TabsList>
                              <TabsContent value="products" className="mt-4">
                                <VendorDashboardPanel onEditPrices={handleOpenPriceEditor} />
                              </TabsContent>
                              <TabsContent value="access" className="mt-4">
                                <VendorAccessManager />
                              </TabsContent>
                            </Tabs>
                          ) : (
                            <VendorDashboardPanel onEditPrices={handleOpenPriceEditor} />
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditorOpen(true)}
                      disabled={isLoading || !products || products.length === 0}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Edit Prices</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="mb-3 h-16 w-16 rounded-full" />
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load products: {error instanceof Error ? error.message : 'Unknown error'}
                </AlertDescription>
              </Alert>
            ) : !products || products.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No products available yet. {isAuthorized && 'Add your first product using the Vendor Panel!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((product) => (
                  <Card
                    key={product.id.toString()}
                    className="cursor-pointer transition-all hover:shadow-md active:scale-95"
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                        {getProductIcon(product.name)}
                      </div>
                      <h4 className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
                        {product.name}
                      </h4>
                      <p className="text-base font-bold text-primary">₹{product.price.toString()}</p>
                      <Button size="sm" className="mt-3 w-full" variant="outline">
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="border-t bg-muted/30 py-8">
          <div className="container px-4">
            <h3 className="mb-6 text-center text-lg font-semibold text-foreground">Why Choose Us</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl">🚚</div>
                  <h4 className="mb-1 text-sm font-medium text-foreground">Fast Delivery</h4>
                  <p className="text-xs text-muted-foreground">Within 30 minutes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl">✨</div>
                  <h4 className="mb-1 text-sm font-medium text-foreground">Fresh Products</h4>
                  <p className="text-xs text-muted-foreground">Quality guaranteed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl">💰</div>
                  <h4 className="mb-1 text-sm font-medium text-foreground">Best Prices</h4>
                  <p className="text-xs text-muted-foreground">Daily deals</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl">🤝</div>
                  <h4 className="mb-1 text-sm font-medium text-foreground">Trusted Service</h4>
                  <p className="text-xs text-muted-foreground">Since 1995</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-6">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Provision Store</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            {isVendorModeEnabled ? (
              <button
                onClick={handleDisableVendorMode}
                className="hover:text-foreground hover:underline"
              >
                Disable Vendor Mode
              </button>
            ) : (
              <button
                onClick={handleEnableVendorMode}
                className="hover:text-foreground hover:underline"
              >
                Enable Vendor Mode
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Price Editor Dialog */}
      <DailyDealsPriceEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        products={products || []}
        isAuthorized={isAuthorized}
      />
    </div>
  );
}
