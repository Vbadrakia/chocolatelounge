import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { cartItems, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-playfair font-bold text-primary">
            Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center">
            <CardContent className="pt-10 pb-12">
              <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some delicious chocolates to get started!
              </p>
              <Button
                size="lg"
                className="w-full max-w-xs"
                onClick={() => setLocation("/")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-right min-w-[80px]">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Payment processing will be available soon!",
                    });
                  }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}