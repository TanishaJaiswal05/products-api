import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit") ?? 20)));
  const q = sp.get("q");
  const category = sp.get("category");
  const sort = sp.get("sort") ?? "-createdAt"; // e.g. price, -price, -rating

  const filter: Record<string, unknown> = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;

  await connectDB();
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const product = await Product.create(parsed.data);
  return NextResponse.json(product, { status: 201 });
}
