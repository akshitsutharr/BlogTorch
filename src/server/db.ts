import { PrismaClient } from "@prisma/client";

function ensureMongoDbName(uri: string) {
  if (!uri) return uri;
  try {
    const u = new URL(uri);
    const isMongo = u.protocol === "mongodb:" || u.protocol === "mongodb+srv:";
    const hasDb = u.pathname && u.pathname !== "/";
    if (isMongo && !hasDb) {
      u.pathname = `/${process.env["MONGODB_DB"] ?? "blogtorch"}`;
      return u.toString();
    }
    return uri;
  } catch {
    return uri;
  }
}

const databaseUrl = ensureMongoDbName(
  process.env["MONGODB_URI"] ?? process.env["DATABASE_URL"] ?? "",
);

if (!databaseUrl) {
  throw new Error("Missing MONGODB_URI or DATABASE_URL for Prisma/MongoDB.");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}


