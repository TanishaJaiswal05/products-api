import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    externalId: { type: Number, unique: true, sparse: true }, // dummyjson's id
    title: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPercentage: Number,
    rating: Number,
    stock: { type: Number, default: 0 },
    brand: String,
    sku: String,
    tags: [String],
    thumbnail: String,
    images: [String],
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

export const Product = models.Product || model("Product", productSchema);
