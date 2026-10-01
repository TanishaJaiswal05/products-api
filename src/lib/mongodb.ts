import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = (g._mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri!, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}
