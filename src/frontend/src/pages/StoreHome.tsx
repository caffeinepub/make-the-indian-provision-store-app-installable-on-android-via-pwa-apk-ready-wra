import { ShoppingBag, Package, Clock, MapPin, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StoreHome() {
  const categories = [
    { name: 'Groceries', icon: '🌾', items: 150 },
    { name: 'Spices', icon: '🌶️', items: 45 },
    { name: 'Snacks', icon: '🍪', items: 80 },
    { name: 'Beverages', icon: '☕', items: 60 },
    { name: 'Personal Care', icon: '🧴', items: 70 },
    { name: 'Toiletries', icon: '🧻', items: 40 },
    { name: 'Household', icon: '🧹', items: 55 },
  ];

  const featuredProducts = [
    { name: 'Basmati Rice', price: '₹120/kg', discount: '10% off', image: '🌾' },
    { name: 'Toor Dal', price: '₹140/kg', discount: '5% off', image: '🫘' },
    { name: 'Atta (Wheat Flour)', price: '₹45/kg', discount: '', image: '🌾' },
    { name: 'Cooking Oil', price: '₹180/L', discount: '15% off', image: '🛢️' },
  ];

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
          <Button size="icon" variant="ghost">
            <ShoppingBag className="h-5 w-5" />
          </Button>
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
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className="cursor-pointer transition-all hover:shadow-md active:scale-95"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-2 text-3xl">{category.icon}</div>
                    <p className="text-xs font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.items} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-6">
          <div className="container px-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Today's Deals</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Card key={product.name} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-muted text-5xl">
                      {product.image}
                    </div>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">{product.price}</span>
                      {product.discount && (
                        <Badge variant="destructive" className="text-xs">
                          {product.discount}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full" size="sm">
                      <Package className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Store Info */}
        <section className="border-t bg-muted/30 py-6">
          <div className="container px-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Store Timings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Saturday</span>
                  <span className="font-medium">7:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">8:00 AM - 9:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 fill-destructive text-destructive" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'provision-store'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Provision Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
