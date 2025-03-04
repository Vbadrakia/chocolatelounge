import express, { type Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';

dotenv.config();

import { registerRoutes } from "./routes";
console.log("All Environment Variables:", JSON.stringify(process.env, null, 2)); // Log all environment variables for debugging
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Log the Stripe secret key

import { setupVite, serveStatic, log } from "./vite";

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Log the Stripe secret key

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: { path: any; method: any; }, res: { json: (bodyJson: any, ...args: any[]) => any; on: (arg0: string, arg1: () => void) => void; statusCode: any; }, next: () => void) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
