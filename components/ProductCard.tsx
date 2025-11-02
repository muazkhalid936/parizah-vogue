import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/models/Product';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
            Featured
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/products/${product._id}`} className="hover:text-purple-600">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
          
          <div className="text-right">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>
        </div>
        
        {product.brand && (
          <div className="mt-2 text-sm text-gray-500">
            Brand: {product.brand}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;