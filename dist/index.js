import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import createMemoryStore from 'memorystore';
import Stripe from 'stripe';
import { z as z2 } from 'zod';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path2, { dirname as dirname2 } from 'path';
import { fileURLToPath as fileURLToPath2 } from 'url';
import { createServer as createViteServer, createLogger } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import themePlugin from '@replit/vite-plugin-shadcn-theme-json';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
  decimal,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const MemoryStore = createMemoryStore(session);

var users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
});

var products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull(),
});

var orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  status: text('status').notNull(),
  items: jsonb('items').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});

var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

var insertProductSchema = createInsertSchema(products);
var insertOrderSchema = createInsertSchema(orders);
var orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  name: z.string(),
  price: z.number(),
});

var MemStorage = class {
  users;
  products;
  orders;
  sessionStore;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.currentId = { users: 1, products: 1, orders: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5,
    });
    this.createUser({
      username: 'admin',
      password: 'admin123',
      isAdmin: true,
    });
    const products2 = [
      {
        name: 'Dark Chocolate Truffles',
        description:
          'Rich dark chocolate truffles with a smooth ganache center',
        price: '12.99',
        imageUrl:
          'https://images.unsplash.com/photo-1584382213731-95e51d7cf4c3',
        stock: 50,
      },
      {
        name: 'Milk Chocolate Bar',
        description: 'Creamy milk chocolate bar made with premium cocoa',
        price: '8.99',
        imageUrl:
          'https://images.unsplash.com/photo-1584382213725-57fd7b14b424',
        stock: 100,
      },
      {
        name: 'White Chocolate Pralines',
        description: 'Luxurious white chocolate with hazelnut praline filling',
        price: '14.99',
        imageUrl:
          'https://images.unsplash.com/photo-1481391319762-47dff72954d9',
        stock: 75,
      },
      {
        name: 'Chocolate Covered Strawberries',
        description: 'Fresh strawberries dipped in Belgian chocolate',
        price: '16.99',
        imageUrl:
          'https://images.unsplash.com/photo-1582293041079-7814c2f12063',
        stock: 30,
      },
      {
        name: 'Assorted Chocolate Box',
        description: 'A curated selection of our finest chocolates',
        price: '24.99',
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b',
        stock: 40,
      },
      {
        name: 'Sea Salt Caramel Chocolates',
        description: 'Dark chocolate with liquid caramel and sea salt',
        price: '18.99',
        imageUrl:
          'https://images.unsplash.com/photo-1606312619070-d48b4c652a52',
        stock: 60,
      },
    ];
    products2.forEach((product) => this.createProduct(product));
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(product) {
    const id = this.currentId.products++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  async updateProduct(id, updates) {
    const product = await this.getProduct(id);
    if (!product) throw new Error('Product not found');
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    this.products.delete(id);
  }
  async getOrders() {
    return Array.from(this.orders.values());
  }
  async getOrdersByUser(userId) {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  async createOrder(order) {
    const id = this.currentId.orders++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) throw new Error('Order not found');
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
};

var storage = new MemStorage();

var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };
  app2.set('trust proxy', 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post('/api/register', async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app2.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

function isAdmin(req) {
  return req.isAuthenticated() && req.user.isAdmin;
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get('/api/products', async (_req, res) => {
    const products2 = await storage.getProducts();
    res.json(products2);
  });
  app2.post('/api/products', async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);
    const validation = insertProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }
    const product = await storage.createProduct(validation.data);
    res.status(201).json(product);
  });
  app2.patch('/api/products/:id', async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);
    const product = await storage.updateProduct(
      parseInt(req.params.id),
      req.body
    );
    res.json(product);
  });
  app2.delete('/api/products/:id', async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);
    await storage.deleteProduct(parseInt(req.params.id));
    res.sendStatus(204);
  });
  app2.post('/api/create-payment-intent', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { amount } = req.body;
      const paymentIntent = await createPaymentIntent(amount);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });
  app2.get('/api/orders', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders2 = req.user.isAdmin
      ? await storage.getOrders()
      : await storage.getOrdersByUser(req.user.id);
    res.json(orders2);
  });
  app2.post('/api/orders', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const validation = insertOrderSchema.safeParse({
      ...req.body,
      userId: req.user.id,
    });
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }
    const order = await storage.createOrder(validation.data);
    res.status(201).json(order);
  });
  app2.patch('/api/orders/:id/status', async (req, res) => {
    if (!isAdmin(req)) return res.sendStatus(403);
    const validation = z2.object({ status: z2.string() }).safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }
    const order = await storage.updateOrderStatus(
      parseInt(req.params.id),
      validation.data.status
    );
    res.json(order);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== void 0
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer()
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
});

var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = 'express') {
  const formattedTime = /* @__PURE__ */ new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: 'custom',
  });
  app2.use(vite.middlewares);
  app2.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        '..',
        'client',
        'index.html'
      );
      let template = await fs.promises.readFile(clientTemplate, 'utf-8');
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, 'public');
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use('*', (_req, res) => {
    res.sendFile(path2.resolve(distPath, 'index.html'));
  });
}

// Load environment variables from .env using dynamic import
(async () => {
  const dotenv = await import('dotenv');
  dotenv.config();
  if (!process.env.SESSION_SECRET) {
    throw new Error('Missing session secret');
  }

  var app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    const start = Date.now();
    const path3 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (path3.startsWith('/api')) {
        let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + '\u2026';
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + '\u2026';
        }
        log(logLine);
      }
    });
    next();
  });

  // Configure express-session with the secret option
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using HTTPS
    })
  );

  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
    throw err;
  });
  if (app.get('env') === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(
    {
      port,
      host: '0.0.0.0',
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
