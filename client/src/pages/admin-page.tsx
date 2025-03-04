import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, Order } from "@shared/schema";
import { DataTable } from "../components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "wouter";
import { apiRequest, queryClient } from "../lib/queryClient";

export default function AdminPage() {
  const { user } = useAuth();
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/orders"] });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>You don't have access to this page.</p>
            <Link href="/">
              <Button className="mt-4" onClick={function (): void {
                throw new Error("Function not implemented.");
              }}>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-playfair">Admin Dashboard</h1>
          <Link href="/">
            <Button variant="outline" onClick={() => window.location.href = "/"}>Back to Store</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={products || []}
              columns={[
                { header: "Name", cell: (row: Product) => row.name },
                { header: "Price", cell: (row: Product) => `$${row.price}` },
                { header: "Stock", cell: (row: Product) => row.stock },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={orders || []}
              columns={[
                { header: "Order ID", cell: (row: Order) => row.id },
                { header: "User ID", cell: (row: Order) => row.userId },
                { header: "Total", cell: (row: Order) => `$${row.total}` },
                { header: "Status", cell: (row: Order) => row.status },
                {
                  header: "Actions",
                  cell: (row: Order) => (
                    <select
                      className="border rounded px-2 py-1"
                      value={row.status}
                      onChange={(e) =>
                        updateOrderStatus.mutate({
                          id: row.id,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}