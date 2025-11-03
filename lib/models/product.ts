import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  sizes: string[]
  stock: number
  images: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL", "XXL"] },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [String], required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
