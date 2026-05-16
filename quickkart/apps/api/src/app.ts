import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

import apiRouter from "./routes/index";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

// ── Request Logging ─────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: "Malformed JSON", code: "BAD_REQUEST" });
  }
  next();
});
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1", apiRouter);

// ── 404 & Global Error Handler ───────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Server Startup ────────────────────────────────────────────────────────────
async function startServer() {
  try {
    // Verify DB connection before accepting traffic
    await prisma.$connect();

    app.listen(port, () => {
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

startServer();
