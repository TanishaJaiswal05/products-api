import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

const updateSchema = z
  .object({
    title: z.string().min(1),
    description: z.string(),
    category: z.string(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    brand: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string().url(),
  })
  .partial();

async function load(ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return { id, bad: true as const };
  await connectDB();
  return { id, bad: false as const };
}

export async function GET(_: NextRequest, ctx: Ctx) {
  const { id, bad } = await load(ctx);
  if (bad) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const product = await Product.findById(id).lean();
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id, bad } = await load(ctx);
  if (bad) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_: NextRequest, ctx: Ctx) {
  const { id, bad } = await load(ctx);
  if (bad) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const product = await Product.findByIdAndDelete(id);
  return product
    ? NextResponse.json({ deleted: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
