// src/index.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import vendorsRoutes from "./routes/vendors.routes";
import productsRoutes from "./routes/products.routes";
import locationRoutes from "./routes/location.routes";
import staffRoutes from "./routes/staff.routes";
import stockMovementRoutes from "./routes/stockMovements.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("running");
});

app.use("/staff", staffRoutes);
app.use("/locations", locationRoutes);
app.use("/vendors", vendorsRoutes);
app.use("/products", productsRoutes);
app.use("/stock-movements", stockMovementRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server was shut down.");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server was shut down.");
    process.exit(0);
  });
});
