import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  calculateTotals(): void;
}

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [99, 'Quantity cannot exceed 99']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  size: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  }
});

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    items: {
      type: [CartItemSchema],
      default: []
    },
    totalItems: {
      type: Number,
      default: 0,
      min: [0, 'Total items cannot be negative']
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
CartSchema.index({ user: 1 }, { unique: true });
CartSchema.index({ 'items.product': 1 });

// Method to calculate totals
CartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((total: number, item: ICartItem) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total: number, item: ICartItem) => total + (item.price * item.quantity), 0);
};

// Pre-save middleware to calculate totals
CartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;