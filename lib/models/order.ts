import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
}

export interface IOrder extends Document {
  userId: string
  items: IOrderItem[]
  totalPrice: number
  status: "Pending" | "Confirmed" | "Delivered"
  location: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Delivered"], default: "Pending" },
    location: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
