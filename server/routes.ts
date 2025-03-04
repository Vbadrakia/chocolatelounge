import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import stripe from "./stripe";

export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  description: z.string().optional(),
  // Add other fields as necessary
});

export const insertOrderSchema = z.object({
  productId: z.number().positive("Product ID must be a positive number"),
  quantity: z.number().positive("Quantity must be a positive number"),
  // Add other fields as necessary
});

// Define the User interface with the correct properties
interface User {
  id: number; // Ensure this matches the actual user object structure
  isAdmin: boolean; // Ensure this matches the actual user object structure
  // Add other properties as necessary
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Ensure that user has the correct type
    }
  }
}

function isAdmin(req: Express.Request): boolean {
  return req.isAuthenticated() && req.user?.isAdmin === true; // Ensure isAdmin is checked correctly
}

export const createPaymentIntent = async (amount: number, currency: string = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe error: ${error}`);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);

    const validation = insertProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const product = await storage.createProduct(validation.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);

    const product = await storage.updateProduct(
      parseInt(req.params.id),
      req.body
    );
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);

    await storage.deleteProduct(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Payment Intent
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { amount } = req.body;
      const paymentIntent = await createPaymentIntent(amount);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const orders = req.user?.isAdmin
      ? await storage.getOrders()
      : await storage.getOrdersByUser(req.user?.id);
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const validation = insertOrderSchema.safeParse({
      ...req.body,
      userId: req.user?.id, // Ensure userId is accessed correctly
    });

    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const order = await storage.createOrder(validation.data);
    res.status(201).json(order);
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);

    const validation = z.object({ status: z.string() }).safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const order = await storage.updateOrderStatus(
      parseInt(req.params.id),
      validation.data.status
    );
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}
