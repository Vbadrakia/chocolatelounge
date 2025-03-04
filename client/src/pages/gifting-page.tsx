import Navbar from "../components/navbar"; // Updated to use relative path and correct quotes
import Footer from "../components/footer"; // Updated to use relative path and correct quotes
import { Button } from "../components/ui/button"; // Updated to use relative path and correct quotes
import { Card, CardContent } from "../components/ui/card"; // Updated to use relative path and correct quotes
import { useToast } from "../hooks/use-toast"; // Updated to use relative path and correct quotes
import { Gift, Package, Heart, PersonStanding, Calendar } from "lucide-react";

export default function GiftingPage() {
  const { toast } = useToast();

  const occasions = [
    {
      title: "Birthday",
      description: "Make their day extra special with our curated chocolate gifts",
      image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Anniversary",
      description: "Celebrate love with our romantic chocolate selections",
      image: "https://images.unsplash.com/photo-1518rusdf795-2e82",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Corporate",
      description: "Impress your clients and colleagues with premium gifts",
      image: "https://images.unsplash.com/photo-156723590-3e82",
      icon: <PersonStanding className="h-6 w-6" />,
    },
    {
      title: "Special Events",
      description: "Perfect for weddings, graduations, and celebrations",
      image: "https://images.unsplash.com/photo-158795-2e82",
      icon: <Gift className="h-6 w-6" />,
    },
  ];

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
            Luxury Chocolate Gifting
          </h1>
          <p className="text-xl max-w-xl">
            Create unforgettable moments with our exquisite chocolate gifts
          </p>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair text-center mb-12">
            Perfect for Every Occasion
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((occasion) => (
              <Card
                key={occasion.title}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="aspect-square mb-6 rounded-lg overflow-hidden">
                    <img
                      src={occasion.image}
                      alt={occasion.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {occasion.icon}
                    <h3 className="text-xl font-medium">{occasion.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{occasion.description}</p>
                  <Button className="w-full mt-4" onClick={() => {/* Handle explore gifts action */}}>
                    Explore Gifts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Wrapping Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-playfair mb-6">
                Exquisite Gift Wrapping
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Each gift is carefully wrapped in our signature packaging, complete
                with elegant ribbons and optional personalized message cards.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Package className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Premium Packaging</h3>
                    <p className="text-muted-foreground">
                      Luxurious gift boxes with gold accents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Personal Touch</h3>
                    <p className="text-muted-foreground">
                      Add a heartfelt message to your gift
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549007994-cb92caebd54b"
                alt="Gift Wrapping"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
