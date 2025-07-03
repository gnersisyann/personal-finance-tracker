import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hono API Server is running! 🚀" });
});

// ===== CATEGORIES =====

app.get("/categories", async (c) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return c.json(categories);
  } catch (error) {
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

app.post("/categories", async (c) => {
  try {
    const body = await c.req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return c.json({ error: "Category name is required" }, 400);
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    return c.json(category, 201);
  } catch (error) {
    return c.json({ error: "Failed to create category" }, 500);
  }
});

app.put("/categories/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return c.json({ error: "Category name is required" }, 400);
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    return c.json(category);
  } catch (error) {
    return c.json({ error: "Failed to update category" }, 500);
  }
});

app.delete("/categories/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));

    await prisma.category.delete({
      where: { id },
    });

    return c.json({ message: "Category deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete category" }, 500);
  }
});

app.delete("/categories/batch", async (c) => {
  try {
    const body = await c.req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: "IDs array is required" }, 400);
    }

    await prisma.category.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return c.json({ message: `${ids.length} categories deleted successfully` });
  } catch (error) {
    return c.json({ error: "Failed to delete categories" }, 500);
  }
});

// ===== TRANSACTIONS =====

app.get("/transactions", async (c) => {
  try {
    const categoryId = c.req.query("categoryId");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    const search = c.req.query("search");

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (search) {
      where.description = {
        contains: search,
        mode: "insensitive",
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    return c.json(transactions);
  } catch (error) {
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

app.post("/transactions", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, categoryId, description } = body;

    if (!amount || amount <= 0) {
      return c.json({ error: "Valid amount is required" }, 400);
    }

    if (!categoryId) {
      return c.json({ error: "Category ID is required" }, 400);
    }

    if (!description || description.trim().length === 0) {
      return c.json({ error: "Description is required" }, 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        description: description.trim(),
        date: new Date(),
      },
      include: {
        category: true,
      },
    });

    return c.json(transaction, 201);
  } catch (error) {
    return c.json({ error: "Failed to create transaction" }, 500);
  }
});

app.put("/transactions/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const { amount, categoryId, description } = body;

    if (!amount || amount <= 0) {
      return c.json({ error: "Valid amount is required" }, 400);
    }

    if (!categoryId) {
      return c.json({ error: "Category ID is required" }, 400);
    }

    if (!description || description.trim().length === 0) {
      return c.json({ error: "Description is required" }, 400);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        description: description.trim(),
      },
      include: {
        category: true,
      },
    });

    return c.json(transaction);
  } catch (error) {
    return c.json({ error: "Failed to update transaction" }, 500);
  }
});

app.delete("/transactions/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));

    await prisma.transaction.delete({
      where: { id },
    });

    return c.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete transaction" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
