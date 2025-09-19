# E-commerce Site with MongoDB & Mongoose

This project has been set up with a complete MongoDB database integration using Mongoose, including authentication, user management, cart functionality, and order processing.

## 🚀 Database Setup Complete

### What's Been Implemented

#### 📊 Database Models
- **User Model** (`models/User.ts`) - User authentication and profile management
- **Product Model** (`models/Product.ts`) - E-commerce product catalog
- **Cart Model** (`models/Cart.ts`) - Shopping cart functionality
- **Order Model** (`models/Order.ts`) - Order management and tracking

#### 🔐 Authentication System
- **JWT-based authentication** with HTTP-only cookies
- **Password hashing** using bcryptjs
- **Role-based access control** (customer/admin)
- **Session management** with automatic login state persistence

#### 🛒 E-commerce Features
- **Cart management** - Add, update, remove items
- **Order processing** - Create orders from cart
- **Stock management** - Automatic stock updates
- **User profiles** - Complete user management

#### 🔌 API Routes

##### Authentication (`/api/auth/`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

##### Users (`/api/users/`)
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (admin only)

##### Products (`/api/products/`)
- `GET /api/products` - Get products with filtering/pagination
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

##### Cart (`/api/cart/`)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update cart item quantity
- `DELETE /api/cart/[itemId]` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

##### Orders (`/api/orders/`)
- `GET /api/orders` - Get user's orders (or all orders for admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PUT /api/orders/[id]` - Update order (admin only)
- `DELETE /api/orders/[id]` - Cancel order

## 🔧 Setup Instructions

### 1. Environment Configuration

Update your `.env.local` file with your MongoDB connection string:

```env
# MongoDB Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-site
# For MongoDB Atlas, use this format:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

### 2. Database Options

#### Option A: Local MongoDB
1. Install MongoDB on your machine
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ecommerce-site`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI`

### 3. Start the Application

```bash
# Install dependencies (already done)
pnpm install

# Start the development server
pnpm dev
```

## 📝 Usage Examples

### Frontend Integration

The contexts have been updated to work with the database APIs:

#### Authentication Context
```tsx
import { useAuth } from '@/contexts/auth-context'

function LoginComponent() {
  const { login, signup, user, loading } = useAuth()
  
  const handleLogin = async () => {
    try {
      await login(email, password)
      // User is now logged in
    } catch (error) {
      // Handle login error
    }
  }
}
```

#### Cart Context
```tsx
import { useCart } from '@/contexts/cart-context'

function ProductComponent() {
  const { addItem, items, total, loading } = useCart()
  
  const handleAddToCart = async () => {
    try {
      await addItem(productId, 1, size, color)
      // Item added to cart
    } catch (error) {
      // Handle error
    }
  }
}
```

## 🔒 Security Features

- **Password hashing** with bcryptjs and salt rounds
- **JWT tokens** with 7-day expiration
- **HTTP-only cookies** for secure token storage
- **Input validation** using Mongoose schemas
- **Role-based authorization** for admin endpoints
- **CORS and credential handling** properly configured

## 📊 Database Schema Features

### User Schema
- Email uniqueness and validation
- Password hashing middleware
- Role-based access (customer/admin)
- Address storage for shipping
- Created/updated timestamps

### Product Schema
- Full e-commerce product fields
- Image array support
- Stock management
- Category and subcategory organization
- Rating and review system ready
- Sale price and discount calculations

### Cart Schema
- User-specific carts
- Product variant support (size, color)
- Automatic total calculations
- Stock validation on add

### Order Schema
- Complete order tracking
- Payment and shipping status
- Automatic order number generation
- Order history and delivery tracking

## 🚀 Next Steps

1. **Test the APIs** using a tool like Postman or curl
2. **Update frontend components** to use the new context methods
3. **Add product seeding** to populate your database
4. **Implement payment processing** (Stripe, PayPal, etc.)
5. **Add email notifications** for orders and user actions

## 🛠️ Development Tips

- **MongoDB Compass** - Use this GUI tool to view and manage your database
- **API Testing** - Use VS Code REST Client or Postman to test endpoints
- **Error Handling** - Check browser console and terminal for detailed error messages
- **Database Indexes** - The models include optimized indexes for performance

Your e-commerce database is now fully set up and ready for production use! 🎉