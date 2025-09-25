//CategoryPage.tsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft, Heart, ImageOff, Loader2, ShoppingCart, Trash2, ChevronDown, Menu } from "lucide-react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  getAllProducts,
  getProductsByCategory,
  Product,
} from "../../redux1/productSlice";

import {
  getAllCategories,
  selectCategories,
  selectCategoryLoading,
} from "../../redux1/categorySlice";

import { 
  addToCart, 
  removeCartItem 
} from "../../redux1/cartSlice";

import { 
  addToWishlist, 
  removeFromWishlist 
} from "../../redux1/wishlistSlice";

import { RootState, AppDispatch } from "../../redux1/store";

// Lazy Image Component for performance optimization
const LazyImage = ({ src, alt, className, overlayContent }: { 
  src: string; 
  alt: string; 
  className?: string;
  overlayContent?: React.ReactNode;
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageRef, setImageRef] = useState<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "50px" }
    );

    if (imageRef) {
      observer.observe(imageRef);
    }

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src]);

  return (
    <div ref={setImageRef} className="relative w-full h-full">
      {isLoading && !imageSrc && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-[inherit] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt={alt}
            className={className}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          {hasError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-[inherit]">
              <ImageOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </>
      )}
      
      {overlayContent}
    </div>
  );
};

const ProductCard = ({
  product,
  currentCart,
  currentWishList,
}: {
  product: Product;
  currentCart: any[];
  currentWishList: Product[];
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isCartLoading, setCartLoading] = useState(false);
  const [isWishLoading, setWishLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(
    currentWishList.some((item) => item._id === product._id)
  );
  const [isInCart, setIsInCart] = useState(
    currentCart.some((item) => item.product._id === product._id)
  );

  // Get user authentication status
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  // Check if product is out of stock
  const isOutOfStock = product.stock === 0;

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate('/auth');
      return;
    }
    
    // Prevent adding to cart if out of stock
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    setCartLoading(true);
     try {
    if (isInCart) {
      // Find the cart item entry
      const cartEntry = currentCart.find(item =>
        typeof item.product === 'object'
          ? item.product._id === product._id
          : item.product === product._id
      );
      if (cartEntry) {
        await dispatch(removeCartItem(cartEntry._id)).unwrap();
        setIsInCart(false);
        toast.success("Removed from cart", { icon: <Trash2 /> });
      }
    } else {
      await dispatch(addToCart({ product: product._id, quantity: 1 })).unwrap();
      setIsInCart(true);
      toast.success("Added to cart", { icon: <ShoppingCart /> });
    }
  } catch {
    toast.error("Failed to update cart");
  } finally {
    setCartLoading(false);
  }
};

  const handleWishToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate('/auth');
      return;
    }
    
    setWishLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await dispatch(removeFromWishlist(product._id)).unwrap();
        setIsInWishlist(false);
        toast.success("Removed from wishlist", { icon: <Trash2 /> });
      } else {
        // Add to wishlist
        await dispatch(addToWishlist({ 
          productId: product._id, 
          priceWhenAdded: product.price 
        })).unwrap();
        setIsInWishlist(true);
        toast.success("Added to wishlist", { icon: <Heart /> });
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div className={cn(
      "w-full h-full flex flex-col rounded-lg shadow-xl",
      isOutOfStock && "opacity-75"
    )}>
      {/* Product Image with Stock Overlay - Fixed aspect ratio */}
      <div className="relative aspect-square w-full">
        <LazyImage
          src={product.images[0] ?? ""}
          alt={product.name}
          className={cn(
            "border-none rounded-t-[inherit] object-cover w-full h-full",
            isOutOfStock && "grayscale"
          )}
          overlayContent={
            isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-[inherit]">
                <span className="text-white font-bold sm:text-lg text-sm bg-red-500 px-2 sm:px-3 py-1 rounded">
                  OUT OF STOCK
                </span>
              </div>
            )
          }
        />
      </div>

      {/* Content section with flex-grow to maintain consistent height */}
      <div className="w-full flex flex-col gap-2 p-3 sm:p-4 flex-grow rounded-b-[inherit]">
        {/* Product name with truncation and fixed height */}
        <h3 className="font-[quicksand] text-base sm:text-xl line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        
        {/* Weight and price */}
        <h6 className="text-gray-600 text-sm sm:text-base">
          {product.weight.number}{product.weight.unit}
        </h6>
        <h6 className="text-sm sm:text-base font-semibold">₹{product.price}</h6>
        
        {/* Stock Status - Only show if out of stock */}
        {isOutOfStock && (
          <div className="text-xs sm:text-sm">
            <span className="text-red-500 font-medium">Out of Stock</span>
          </div>
        )}

        {/* Button with consistent positioning */}
        <div className="mt-auto">
          <Button
            className={cn(
              "flex justify-center items-center gap-2 sm:gap-4 w-full text-xs sm:text-sm",
              isOutOfStock && "opacity-50 cursor-not-allowed"
            )}
            variant={isOutOfStock ? "secondary" : "ghost"}
            onClick={handleCartToggle}
            disabled={isCartLoading || isOutOfStock}
          >
            {isCartLoading ? (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : isInCart ? (
              <span className="truncate">- Remove from cart</span>
            ) : (
              <span className="truncate">+ Add to cart</span>
            )}
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          </Button>
        </div>
      </div>
      
      {/* Wishlist button */}
      <button 
        onClick={handleWishToggle}
        className="absolute top-[3%] right-[5%] z-10"
        disabled={isWishLoading}
      >
        <Heart 
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 hover:stroke-red-500 hover:scale-110 transition-all duration-150",
            isInWishlist && "stroke-red-500 fill-red-500",
            isWishLoading && "animate-pulse"
          )}
        />
      </button>
    </div>
  );
};

export const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name } = useParams<{ name: string }>();

  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoryLoading);
  const allProducts = useSelector((state: RootState) => state.product.products);
  const categoryProducts = useSelector((state: RootState) => state.product.categoryProducts);
  
  // Get actual cart and wishlist data from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [products, setProducts] = useState(allProducts);
  const [currentCategory, setCurrentCategory] = useState(name || "all");
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Function to sort products - in-stock first, out-of-stock last
  const sortProductsByStock = (productsArray: Product[]) => {
    if (!productsArray || productsArray.length === 0) return [];
    return [...productsArray].sort((a, b) => {
      // If 'a' is in stock and 'b' is out of stock, 'a' should come first
      if (a.stock > 0 && b.stock === 0) return -1;
      // If 'a' is out of stock and 'b' is in stock, 'b' should come first
      if (a.stock === 0 && b.stock > 0) return 1;
      // If both have same stock status, maintain original order
      return 0;
    });
  };

  // Create a combined products array for wishlist mapping
  const allAvailableProducts = [...(allProducts || []), ...(categoryProducts || [])];
  const uniqueProducts = allAvailableProducts.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getAllCategories());
    }
  }, [categories.length, dispatch]);

  useEffect(() => {
    if (name === "all" || !name) {
      dispatch(getAllProducts({ page: 1, limit: 100 }));
      setCurrentCategory("all");
    } else {
      dispatch(getProductsByCategory({ categoryId: name!, page: 1, limit: 100 }));
      setCurrentCategory(name!);
    }
  }, [name, dispatch]);

  useEffect(() => {
    let productsToSort;
    if (currentCategory === "all") {
      productsToSort = allProducts;
    } else {
      productsToSort = categoryProducts;
    }
    
    // Sort products to show in-stock first, out-of-stock last
    const sortedProducts = productsToSort ? sortProductsByStock(productsToSort) : [];
    setProducts(sortedProducts);
  }, [allProducts, categoryProducts, currentCategory]);

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const getCategoryName = () => {
    if (currentCategory === "all") return "All Products";
    const category = categories.find((cat) => cat._id === currentCategory);
    return category?.name ?? "Category";
  };

  const ALL_PRODUCTS_IMAGE_URL = "https://res.cloudinary.com/dmrgscauc/image/upload/v1758780847/Untitled_design_7_dzo4vj.png";

  return (
    <div className="mt-[56px] font-[quicksand] flex w-full min-h-[calc(100vh-56px)]">
      {/* Desktop Sidebar */}
      <section id="side-bar" className="w-[300px] sm:block hidden p-4 relative border-r h">
        <div className="flex flex-col items-center gap-4">
          {/* Add "All Products" option */}
          <Link
            className={cn(
              "transition-all duration-150 py-4 w-full rounded-md text-center",
              currentCategory === "all"
                ? "bg-yellow-300 text-white"
                : "hover:bg-gray-200"
            )}
            to="/category/all"
            onClick={() => setCurrentCategory("all")}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              className={cn(
                "transition-all duration-150 py-4 w-full rounded-md text-center",
                currentCategory === cat._id
                  ? "bg-yellow-300 text-white"
                  : "hover:bg-gray-200"
              )}
              to={`/category/${cat._id}`}
              onClick={() => setCurrentCategory(cat._id)}
            >
              {cat.name}
            </Link>
          ))}   
        </div>
      </section>

      <section id="products" className="p-4 sm:p-6 flex-1">
        {/* Mobile Header with Back Button and Category Dropdown */}
        <div className="sm:hidden flex items-center justify-between mb-4">
          <Link to={"/"}>
            <ChevronLeft className="hover:scale-125 transition-all duration-300" />
          </Link>
          
          {/* Mobile Category Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="flex items-center gap-2 bg-yellow-300 text-white px-4 py-2 rounded"
            >
              <Menu className="w-4 h-4" />
              <span>{getCategoryName()}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDropdownOpen && "rotate-180")} />
            </Button>
            
            {/* Dropdown Menu */}
            {mobileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {/* All Products Option */}
                <Link 
                  to="/category/all"
                  onClick={() => {
                    setCurrentCategory("all");
                    setMobileDropdownOpen(false);
                  }}
                  className={cn(
                    "block px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100",
                    currentCategory === "all" && "bg-yellow-50 text-yellow-600 font-medium"
                  )}
                >
                  All Products
                </Link>
                
                {/* Category Options */}
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat._id}`}
                    onClick={() => {
                      setCurrentCategory(cat._id);
                      setMobileDropdownOpen(false);
                    }}
                    className={cn(
                      "block px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0",
                      cat._id === currentCategory && "bg-yellow-50 text-yellow-600 font-medium"
                    )}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Back Button (hidden on mobile) */}
        <Link className="hidden sm:block" to={"/"}>
          <ChevronLeft className="hover:scale-125 transition-all duration-300 mb-4 top-4 left-4" />
        </Link>

        
        {/* Category banner with lazy loading */}
        <div className="mb-6">
          {currentCategory === "all" ? (
            <LazyImage
              src={ALL_PRODUCTS_IMAGE_URL}
              alt="All Products Banner"
              className="w-full h-80 rounded object-cover"
            />
          ) : categories.find((cat) => cat._id === currentCategory)?.image ? (
            <LazyImage
              src={categories.find((cat) => cat._id === currentCategory)?.image || ""}
              alt={`${getCategoryName()} Banner`}
              className="w-full h-80 rounded object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gray-300 rounded flex items-center justify-center">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        {/* Products Grid - Adjusted for consistent card sizes */}
        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr" id="product-list">
          {!products && <Loader2 className="w-4 h-4 animate-spin" />}
          {products?.length === 0 && <p className="col-span-full text-center font-[quicksand] text-yellow-600 w-full h-full">No products under this category!</p>}
          {products?.map((product) => {
            return (
              <Link 
                key={product._id} 
                to={`/product/${product._id}`} 
                className="block hover:scale-105 transition-transform duration-200 h-full"
              >
                <ProductCard
                  product={product}
                  currentCart={cartItems}
                  currentWishList={wishlistItems
                    .map(item => uniqueProducts.find(p => p._id === item.product))
                    .filter((p): p is Product => !!p)
                  }
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Click outside to close dropdown */}
      {mobileDropdownOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-40" 
          onClick={() => setMobileDropdownOpen(false)}
        />
      )}
    </div>
  ); 
};