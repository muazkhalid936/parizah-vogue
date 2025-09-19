import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  featured: boolean;
  active: boolean;
  salePrice?: number;
  discount?: number;
  rating: {
    average: number;
    count: number;
  };
  reviews?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DimensionsSchema = new Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true }
});

const RatingSchema = new Schema({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0, min: 0 }
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function(images: string[]) {
          return images.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sizes: {
      type: [String],
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: DimensionsSchema,
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
      validate: {
        validator: function(this: IProduct, salePrice: number) {
          return !salePrice || salePrice < this.price;
        },
        message: 'Sale price must be less than regular price'
      }
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot be more than 100%'],
      default: 0
    },
    rating: {
      type: RatingSchema,
      default: { average: 0, count: 0 }
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }]
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ featured: 1, active: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ createdAt: -1 });

// Virtual for effective price (sale price or regular price)
ProductSchema.virtual('effectivePrice').get(function() {
  return this.salePrice || this.price;
});

// Virtual for availability
ProductSchema.virtual('available').get(function() {
  return this.active && this.stock > 0;
});

// Calculate discount percentage before saving
ProductSchema.pre('save', function(next) {
  if (this.salePrice && this.salePrice < this.price) {
    this.discount = Math.round(((this.price - this.salePrice) / this.price) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;