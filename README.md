# Parizah Vogue - Fashion E-Commerce Platform

A complete fashion e-commerce website for selling ladies' dresses online with an elegant gold and black luxury brand aesthetic.

## Features

### User Features
- **Homepage** - Hero section with featured products and category highlights
- **Shop Page** - Browse all products with filters (price, category)
- **Product Details** - View detailed product information with size and quantity selection
- **Authentication** - User signup and login with JWT
- **Shopping Cart** - Add/remove products and checkout
- **Order History** - View all orders with real-time status updates

### Admin Features
- **Product Management** - Add, edit, and delete products
- **Order Management** - View all customer orders and update status (Pending → Confirmed → Delivered)
- **Admin Dashboard** - Comprehensive admin panel for managing the store

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TailwindCSS v4
- React 19
- Responsive design

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Services
- Cloudinary for image storage
- MongoDB Atlas for database

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

### 4. Test Accounts

**Admin Login:**
- Email: admin@parizah.com
- Password: admin123

### 5. Database Setup

Create a MongoDB database and update the connection string in `.env.local`.

## Project Structure

\`\`\`
src/
├── app/
│   ├── page.tsx (Home)
│   ├── shop/ (Product listing)
│   ├── product/[id]/ (Product details)
│   ├── cart/ (Shopping cart)
│   ├── orders/ (Order history)
│   ├── login/ (Auth)
│   ├── admin/ (Admin dashboard)
│   └── api/ (Backend routes)
├── components/
│   ├── navbar.tsx
│   └── ui/ (UI components)
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── models/ (Mongoose schemas)
│   ├── auth.ts (JWT utilities)
│   └── cloudinary.ts (Image upload)
└── globals.css (Tailwind & theme)
\`\`\`

## Key Features

- **Elegant Design** - Gold (#d4af37) and black (#1a1a1a) luxury theme
- **Responsive** - Mobile-first design that works on all devices
- **Secure** - JWT authentication, password hashing, role-based access
- **Scalable** - MongoDB for flexible data storage
- **Professional** - Clean UI with smooth transitions and hover effects

## Deployment

Deploy to Vercel:
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

## Support

For issues or questions, please create an issue in the repository.
