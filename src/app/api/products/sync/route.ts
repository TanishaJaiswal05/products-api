import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function POST() {
  const res = await fetch("https://dummyjson.com/products?limit=0", { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }
  const { products } = await res.json();

  await connectDB();
  const result = await Product.bulkWrite(
    products.map((p: any) => ({
      updateOne: {
        filter: { externalId: p.id },
        update: {
          $set: {
            externalId: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            price: p.price,
            discountPercentage: p.discountPercentage,
            rating: p.rating,
            stock: p.stock,
            brand: p.brand,
            sku: p.sku,
            tags: p.tags,
            thumbnail: p.thumbnail,
            images: p.images,
          },
        },
        upsert: true,
      },
    }))
  );

  return NextResponse.json({
    fetched: products.length,
    inserted: result.upsertedCount,
    updated: result.modifiedCount,
  });
}
