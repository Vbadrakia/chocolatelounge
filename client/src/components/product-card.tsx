import { Product } from "@shared/schema";
import Button from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useState } from "react";
import { useCart } from '../hooks/use-cart';
import { Minus, Plus, Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  const addToCartHandler = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price) * 100, // Convert to cents
      quantity: quantity,
    });
    if (showQuickView) {
      setShowQuickView(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 5) setQuantity(q => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <>
      <Card className="group overflow-hidden">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
          />
          <Button
            aria-label="Add to favorites"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            onClick={() => {}} // Placeholder for the onClick function
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            aria-label="Quick view of the product"
            variant="secondary"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowQuickView(true)}
          >
            Quick View
          </Button>
        </div>
        <CardHeader className="pt-4">
          <CardTitle className="font-playfair text-lg">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">${Number(product.price).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {product.stock} in stock
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-4">
          <div className="flex items-center border rounded-md">
            <Button
              aria-label="Decrease quantity"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              aria-label="Increase quantity"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button className="flex-1" onClick={addToCartHandler}>
            Add to Cart
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quick View</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="space-y-4">
              <h3 className="font-playfair text-xl">{product.name}</h3>
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-2xl font-semibold">
                ${Number(product.price).toFixed(2)}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    aria-label="Decrease quantity"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    aria-label="Increase quantity"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-1" onClick={addToCartHandler}>
                  Add to Cart
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.stock} in stock
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
