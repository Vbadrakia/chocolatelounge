import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "../hooks/use-cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Minus, Plus, Package2, Check } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
};

const fetchProducts = async () => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function CustomBoxPage() {
  const { toast } = useToast();
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: fetchProducts,
  });
  const { addToCart } = useCart();
  const [boxSize, setBoxSize] = useState("6");
  const [selectedChocolates, setSelectedChocolates] = useState<
    { id: number; quantity: number }[]
  >([]);

  const maxChocolates = Number(boxSize);
  const currentTotal = selectedChocolates.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleQuantityChange = (productId: number, change: number) => {
    setSelectedChocolates((current) => {
      const existing = current.find((item) => item.id === productId);
      const newTotal = currentTotal + change;

      if (newTotal > maxChocolates) {
        toast({
          title: "Maximum chocolates reached",
          description: `You can only select ${maxChocolates} chocolates for this box size.`,
        });
        return current;
      }

      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return current.filter((item) => item.id !== productId);
        }
        return current.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }

      if (change > 0) {
        return [...current, { id: productId, quantity: 1 }];
      }

      return current;
    });
  };

  const handleAddToCart = () => {
    if (currentTotal !== maxChocolates) {
      toast({
        title: "Invalid selection",
        description: `Please select exactly ${maxChocolates} chocolates for your box.`,
      });
      return;
    }

    const customBox = {
      productId: Date.now(),
      name: `Custom ${boxSize}-Piece Box`,
      price: Number(boxSize) * 500,
      quantity: 1,
    };

    addToCart(customBox);
    toast({
      title: "Custom box added",
      description: "Your custom chocolate box has been added to cart.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1549007994-cb92caebd54b)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative text-white">
          <h1 className="text-4xl md:text-5xl font-playfair mb-4">
            Create Your Custom Box
          </h1>
          <p className="text-xl max-w-xl">
            Select your favorite chocolates and create your perfect assortment
          </p>
        </div>
      </section>

      {/* Custom Box Builder */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-playfair">Box Builder</h2>
              <Select value={boxSize} onValueChange={setBoxSize}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select box size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Pieces</SelectItem>
                  <SelectItem value="12">12 Pieces</SelectItem>
                  <SelectItem value="24">24 Pieces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      Selected: {currentTotal} / {maxChocolates}
                    </span>
                  </div>
                  <p className="font-medium">
                    Total: ${((Number(boxSize) * 500) / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={currentTotal !== maxChocolates}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {products?.map((product) => {
                const selected = selectedChocolates.find(
                  (item) => item.id === product.id
                );
                return (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(product.id, -1)
                              }
                              disabled={!selected}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {selected?.quantity || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              disabled={currentTotal >= maxChocolates}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
