// ProductPage.tsx
import { ChevronLeft, LucideHeart, LucideImageOff, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ToastSuccess } from "../dashboard/productMain/AllProductsTable"; // Adjust import if needed
import { CarouselApi } from "../ui/carousel";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux1/store";
import { getProductById, selectCurrentProduct, selectProductLoading } from "../../redux1/productSlice";
import { addToCart, removeCartItem } from "../../redux1/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux1/wishlistSlice";

export const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  ;
  const loading = useSelector(selectProductLoading);
  const productData = useSelector(selectCurrentProduct);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  // Get user authentication status
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;
  
  const images = productData?.images ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const [api] = useState<CarouselApi | undefined>(undefined);
  const [, setCurrent] = useState(0);
  const [, setCount] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (productData) {
      setIsInCart(cartItems.some(item => (typeof item.product === 'string' ? item.product === productData._id : item.product?._id === productData._id)));
      setIsInWishlist(wishlistItems.some(item => item.product === productData._id));
    }
  }, [cartItems, wishlistItems, productData]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

   useEffect(() => {
    // Reset selected image if product images or product changes
    setSelectedIndex(0);
  }, [productData]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }

return (
        <div className="min-h-[calc(100vh-56px)] w-full mt-14 sm:mt-0 sm:p-10 flex flex-col sm:grid sm:grid-cols-2 sm:gap-[4rem]">
            <div className="flex flex-col items-center sm:items-start sm:justify-center sm:h-full sm:pl-6">
                <div className="w-full sm:pb-6">
                    <Button variant={"ghost"} onClick={() => navigate(-1)}><ChevronLeft /></Button>
                </div>
                <div className="flex flex-col items-center w-full sm:px-8">
                  {/* Main Product Image */}
                  <div className="w-full flex justify-center mb-4">
                    {images.length > 0 ? (
                      <img
                        src={images[selectedIndex]}
                        alt={`Product Image ${selectedIndex + 1}`}
                        className="rounded-md object-contain shadow-lg"
                        style={{
                          width: "530px",
                          height: "420px",
                          borderRadius: "1rem"
                        }}
                      />
                    ) : (
                      <div className="bg-gray-300 rounded-md w-[350px] h-[350px] flex justify-center items-center">
                        <LucideImageOff className="" />No product images present
                      </div>
                    )}
                  </div>
        
                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-4 justify-center mt-2">
                      {images.map((imgSrc, idx) => (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt={`Thumbnail ${idx + 1}`}
                          onClick={() => setSelectedIndex(idx)}
                          className={cn(
                            "h-16 w-16 object-cover cursor-pointer rounded border",
                            idx === selectedIndex
                              ? "border-yellow-400 shadow-md"
                              : "border-gray-200"
                          )}
                          style={{
                            boxShadow: idx === selectedIndex ? "0 0 0 2px #facc15" : undefined
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            
            <div className="flex gap-10 flex-col sm:mt-32 mt-4 items-center font-[quicksand] flex-1 mx-3">
                <div id="head" className="flex flex-col h-full gap-2">
                    <h1 className="font-bold text-3xl">{productData?.name ? productData?.name : <Skeleton className="h-8 w-56" />}</h1>
                    <div className="flex flex-row gap-5 text-gray-500 font-bold">
                        <span className="text-lg text-gray-500 font-sans">{productData?.weight ? productData?.weight?.number + productData?.weight?.unit : <Skeleton className="h-5 w-20" />}</span>
                        <span className="text-lg ">{productData?.price ? "₹" + productData?.price : <Skeleton className="h-5 w-14" />}</span>
                    </div>
                    {productData?.description !== "" && (
                        <h3 className="font-sans text-gray-500 ">
                            {productData?.description ? productData?.description : <Skeleton className="h-4 w-full" />}
                        </h3>
                    )}
                </div>
                <div className="sm:grid sm:w-[500px] flex sm:grid-cols-6 justify-center items-center flex-row sm:grid-rows-2 gap-10 sm:gap-2">
                    {productData?._id ? (
                        <Button
                            disabled={cartLoading}
                            onClick={async (e) => {
                                e.preventDefault();
                                
                                // Check if user is authenticated
                                if (!isAuthenticated) {
                                    toast.error("Please login to add items to cart");
                                    navigate('/auth');
                                    return;
                                }
                                
                                setCartLoading(true);
                                if (isInCart) {
                                  // 1. Find the cart item record for this product
                                  const cartEntry = cartItems.find(item =>
                                    typeof item.product === 'string'
                                      ? item.product === productData._id
                                      : item.product?._id === productData._id
                                  );
                                
                                  if (!cartEntry) {
                                    toast.error("Cart item not found");
                                  } else {
                                    // 2. Remove using the cart-item's _id
                                    await dispatch(removeCartItem(cartEntry._id)).unwrap();
                                    setIsInCart(false);
                                    toast.success("Product removed from cart successfully!", {
                                      className: "font-[quicksand]",
                                      icon: <Trash2 className="w-4 h-4 stroke-red-500" />
                                    });
                                  }
                                  setCartLoading(false);
                                  return;
                                }
                                await dispatch(addToCart({ product: productData._id, quantity: 1 })).unwrap();
                                setCartLoading(false);
                                setIsInCart(true);
                                return toast.success("Product added to cart successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
                            }}
                            variant={"ghost"}
                            className={cn("flex col-span-5 row-span-1 justify-center items-center gap-2 text-lg", cartLoading && `bg-gray-100`)}
                        >
                            {isInCart ? "- Remove from cart " : "+ Add to cart "}
                            <ShoppingCart className="stroke-1" />
                        </Button>
                    ) : (
                        <Skeleton className="row-span-1 col-span-5" />
                    )}
                    {productData?._id ? (
                        <Button
                            onClick={async (e) => {
                                e.preventDefault();
                                
                                // Check if user is authenticated
                                if (!isAuthenticated) {
                                    toast.error("Please login to add items to wishlist");
                                    navigate('/auth');
                                    return;
                                }
                                
                                setWishLoading(true);
                                if (isInWishlist) {
                                    await dispatch(removeFromWishlist(productData._id)).unwrap();
                                    setWishLoading(false);
                                    setIsInWishlist(false);
                                    return toast.success("Product deleted from wishlist successfully!", { className: "font-[quicksand]", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                                }
                                await dispatch(addToWishlist({ productId: productData._id, priceWhenAdded: productData.price })).unwrap();
                                setWishLoading(false);
                                setIsInWishlist(true);
                                return toast.success("Product added to wishlist successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
                            }}
                            variant={"ghost"}
                            className="col-span-1 row-span-1 p-0 m-0 hover:scale-125 transition-all duration-150 w-10 h-10 rounded-full"
                        >
                            <LucideHeart className={cn("hover:stroke-red-500 stroke-1", isInWishlist && `fill-red-500 stroke-red-500`, wishLoading && `animate-ping`)} />
                        </Button>
                    ) : (
                        <Skeleton className="w-10 h-10 rounded-full" />
                    )}
                </div>
            </div>
        </div>
    );
};