import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Product } from "@shared/schema";
import { useCart } from "../hooks/use-cart";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

// This will be replaced with actual API data later
const mockFavorites: Product[] = [
  {
    id: 1,
    name: "Dark Chocolate Truffles",
    description: "Rich dark chocolate truffles with a smooth ganache center",
    price: "12.99",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
    stock: 50,
  },
  {
    id: 2,
    name: "Milk Chocolate Bar",
    description: "Creamy milk chocolate bar made with premium cocoa",
    price: "8.99",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
    stock: 100,
  },
];

export default function FavoritesPage() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<Product[]>(mockFavorites);

  const toggleFavorite = (productId: number) => {
    setFavorites((current) => {
      const isFavorite = current.some((item) => item.id === productId);
      if (isFavorite) {
        return current.filter((item) => item.id !== productId);
      } else {
        const newFavorite = mockFavorites.find((item) => item.id === productId);
        return newFavorite ? [...current, newFavorite] : current;
      }
    });
  };

  const [_, setLocation] = useLocation();
  const removeFavorite = (productId: number) => {
    setFavorites((current) => current.filter((item) => item.id !== productId));
    toast({
      title: "Removed from favorites",
      description: "The item has been removed from your favorites.",
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price) * 100, // Convert to cents
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: "The item has been added to your cart.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-playfair">My Favorites</h1>
          </div>
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-medium mb-2">No favorites yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding your favorite chocolates by clicking the heart icon on any product
                </p>
                <Button onClick={() => setLocation("/collections/best-sellers")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <Card key={product.id} className="group">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart className={`h-5 w-5 ${favorites.some(item => item.id === product.id) ? 'text-red-500' : 'text-gray-500'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFavorite(product.id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
