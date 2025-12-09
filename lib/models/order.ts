import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
}

export interface IGuestInfo {
  name: string
  phone: string
  email: string
  address: string
}

export interface IOrder extends Document {
  userId?: string
  guestInfo?: IGuestInfo
  items: IOrderItem[]
  totalPrice: number
  status: "Pending" | "Confirmed" | "Delivered"
  location: string
  isGuest: boolean
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    guestInfo: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      email: { type: String, required: false },
      address: { type: String, required: false },
    },
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
    isGuest: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
