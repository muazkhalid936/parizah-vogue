import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: "stitched" | "unstitched" | "party" | string
  sizes: string[]
  stock: number
  images: string[]
  video?: string
  featured: boolean
  isNew: boolean
  trending: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ["stitched", "unstitched", "party"],
      default: "unstitched"
    },
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL", "XXL"] },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [String], required: true, validate: [arrayLimit, 'Images array must have between 1 and 5 items'] },
    video: { type: String },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true },
)

function arrayLimit(val: string[]) {
  return val.length >= 1 && val.length <= 5
}

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
