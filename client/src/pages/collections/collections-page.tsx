import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "../components/ProductCard"; // Corrected import path to match casing
import Navbar from "../components/navbar"; // Corrected import path
import Footer from "../components/footer"; // Corrected import path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"; // Ensure this path is correct
import { useRoute } from "wouter";

export default function CollectionsPage() {
  const { data: products, error } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  if (error) {
    return <div>Error fetching products</div>;
  }

  const [sortBy, setSortBy] = useState("featured");
  const [match, params] = useRoute("/collections/:category");

  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (!products) return 0; // Handle case when products is undefined
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price);
      case "price-high":
        return Number(b.price) - Number(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categories = {
    "best-sellers": {
      title: "Best Sellers",
      description: "Our most loved chocolate collections",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b"
    },
    "new-arrivals": {
      title: "New Arrivals",
      description: "Fresh and exciting chocolate creations",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9"
    },
    "premium": {
      title: "Premium Collection",
      description: "Luxury chocolates for discerning tastes",
      image: "https://images.unsplash.com/photo-1581399266882-8b0d864d2ee9"
    }
  };

  const currentCategory = params?.category;
  const category = currentCategory ? categories[currentCategory as keyof typeof categories] : null;

  if (!category) return <div>Category not found</div>; // Handle case when category is not found

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-cover bg-center flex items-center" 
        style={{ backgroundImage: `url(${category.image})` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative text-white">
          <h1 className="text-4xl md:text-5xl font-playfair mb-4">
            {category.title}
          </h1>
          <p className="text-xl max-w-xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-playfair">Our Selection</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
