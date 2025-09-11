import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft, Heart, ImageOff, Loader2, ShoppingCart, Trash2, ChevronDown, Menu } from "lucide-react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  selectProducts,
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
  const [isCartLoading, setCartLoading] = useState(false);
  const [isWishLoading, setWishLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(
    currentWishList.some((item) => item._id === product._id)
  );
  const [isInCart, setIsInCart] = useState(
    currentCart.some((item) => item.product._id === product._id)
  );

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCartLoading(true);
    try {
      if (isInCart) {
        await dispatch(removeCartItem(product._id)).unwrap();
        setIsInCart(false);
        toast.success("Removed from cart", { icon: <Trash2 /> });
      } else {
        await dispatch(addToCart({ product: product._id, quantity: 1 })).unwrap();
        setIsInCart(true);
        toast.success("Added to cart", { icon: <ShoppingCart /> });
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="max-w-[250px] w-full col-span-1 justify-self-center relative rounded-lg shadow-xl">
      <img
        src={product.images[0] ?? ""}
        alt={product.name}
        className="border-none rounded-t-[inherit] object-cover w-full h-auto aspect-square"
      />
      <div className="w-full flex flex-col gap-2 p-4 h-1/3 rounded-b-[inherit]">
        <h3 className="font-[quicksand] text-xl">{product.name}</h3>
        <h6 className="text-gray-600">{product.weight.number}{product.weight.unit}</h6>
        <h6 className="">₹{product.price}</h6>
        <Button
          className="flex justify-center items-center gap-4 w-full"
          variant="ghost"
          onClick={handleCartToggle}
          disabled={isCartLoading}
        >
          {isCartLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isInCart ? (
            "- Remove from cart"
          ) : (
            "+ Add to cart"
          )}
          <ShoppingCart />
        </Button>
      </div>
      <button 
        onClick={handleWishToggle}
        className="absolute top-[3%] right-[5%]"
        disabled={isWishLoading}
      >
        <Heart 
          className={cn(
            "hover:stroke-red-500 hover:scale-110 transition-all duration-150",
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
  const navigate = useNavigate();
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
    if (currentCategory === "all") {
      setProducts(allProducts);
    } else {
      setProducts(categoryProducts);
    }
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

  const ALL_PRODUCTS_IMAGE_URL = "https://res.cloudinary.com/dmrgscauc/image/upload/v1756883051/banner_ha5rfq.png"; // <-- use your static image URL

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

      <section id="products" className="p-6 flex-1">
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

        
        {/* Category banner */}
        <div className="mb-6">
          {currentCategory === "all" ? (
            <img
              src={ALL_PRODUCTS_IMAGE_URL}
              alt="All Products Banner"
              className="w-full h-80 rounded object-cover"
            />
          ) : categories.find((cat) => cat._id === currentCategory)?.image ? (
            <img
              src={categories.find((cat) => cat._id === currentCategory)?.image}
              alt={`${getCategoryName()} Banner`}
              className="w-full h-80 rounded object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gray-300 rounded flex items-center justify-center">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="py-4 grid sm:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 items-center gap-4 justify-center" id="product-list">
          {!products && <Loader2 className="w-4 h-4 animate-spin" />}
          {products?.length === 0 && <p className="col-span-full text-center font-[quicksand] text-yellow-600 w-full h-full">No products under this category!</p>}
          {products?.map((product) => {
            return (
              <Link key={product._id} to={`/product/${product._id}`} className="block hover:scale-105 transition-transform duration-200">
                <ProductCard
                  product={product}
                  currentCart={cartItems} // Pass actual cart data from Redux
                  currentWishList={wishlistItems
                    .map(item => allProducts.find(p => p._id === item.product))
                    .filter((p): p is Product => !!p)
                  } // Map wishlist items to full Product objects
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
