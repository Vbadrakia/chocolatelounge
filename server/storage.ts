import { User, Product, Order, InsertUser, InsertProduct, InsertOrder, CartItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  sessionStore: session.Store;
  private currentId: { users: number; products: number; orders: number };

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.currentId = { users: 1, products: 1, orders: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true,
    } as InsertUser);

    // Seed some products
    const products = [
      {
        name: "Dark Chocolate Truffles",
        description: "Rich dark chocolate truffles with a smooth ganache center",
        price: "12.99",
        imageUrl: "https://images.unsplash.com/photo-1584382213731-95e51d7cf4c3",
        stock: 50,
      },
      {
        name: "Milk Chocolate Bar",
        description: "Creamy milk chocolate bar made with premium cocoa",
        price: "8.99",
        imageUrl: "https://images.unsplash.com/photo-1584382213725-57fd7b14b424",
        stock: 100,
      },
      {
        name: "White Chocolate Pralines",
        description: "Luxurious white chocolate with hazelnut praline filling",
        price: "14.99",
        imageUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9",
        stock: 75,
      },
      {
        name: "Chocolate Covered Strawberries",
        description: "Fresh strawberries dipped in Belgian chocolate",
        price: "16.99",
        imageUrl: "https://images.unsplash.com/photo-1582293041079-7814c2f12063",
        stock: 30,
      },
      {
        name: "Assorted Chocolate Box",
        description: "A curated selection of our finest chocolates",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b",
        stock: 40,
      },
      {
        name: "Sea Salt Caramel Chocolates",
        description: "Dark chocolate with liquid caramel and sea salt",
        price: "18.99",
        imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52",
        stock: 60,
      }
    ];

    products.forEach((product) => this.createProduct(product as InsertProduct));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();