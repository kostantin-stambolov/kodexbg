import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// Лениво създаване – клиентът не се вдига при import (за да не чупи build,
// когато DATABASE_URL още не е наличен), а при първа реална заявка.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
  __db?: Db;
};

export function getDb(): Db {
  if (globalForDb.__db) return globalForDb.__db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Липсва DATABASE_URL");
  }

  const client =
    globalForDb.__pgClient ?? postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__pgClient = client;
    globalForDb.__db = db;
  }

  return db;
}
