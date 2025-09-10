import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess } from "../dashboard/productMain/AllProductsTable";

import { RootState, AppDispatch } from "../../redux1/store";

import {
  fetchCartDetails,
  selectCartItems,
  selectCartTotals,
  selectCartLoading,
  updateCartItem,
  removeCartItem,
  clearCart,
  selectUpdateCartLoading,
  selectRemoveCartLoading,
} from "../../redux1/cartSlice";

import { Product } from "../../redux1/productSlice";
import { selectUser } from "../../redux1/authSlice";

import {
  createOrder,
} from "../../redux1/orderSlice";

import {
  initiatePayment,
  handlePaymentSuccess,
  RazorpayPaymentData,
} from "../../redux1/paymentSlice";

import {
  getDiscountByCode,
  selectCurrentDiscount,
  selectDiscountLoading,
  selectDiscountError,
  clearCurrentDiscount,
} from "../../redux1/discountSlice";

interface CartItemProps {
  item: any;
  dispatch: AppDispatch;
  userPresent: boolean;
  quantity: number;
  itemId: string;
  product: Product;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  dispatch,
  userPresent,
  quantity,
  itemId,
}) => {
  const product: Product | undefined = useSelector((state: RootState) => {
    if (typeof item.product === "string") {
      return state.product.products.find((p) => p._id === item.product);
    }
    return item.product as Product;
  });

  const updateLoading = useSelector(selectUpdateCartLoading);
  const removeLoading = useSelector(selectRemoveCartLoading);

  const isCartUpdating = updateLoading || removeLoading;
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const [count, setCount] = useState(item.quantity);
  const [loadingMinus, setLoadingMinus] = useState(false);
  const [loadingPlus, setLoadingPlus] = useState(false);
  

  useEffect(() => {
    setCount(item.quantity);
  }, [item.quantity]);

  if (!product) return <div>Loading product...</div>;

  const handleRemove = async () => {
    if (isCartUpdating) return;
    try {
      await dispatch(removeCartItem(item._id)).unwrap();
      toast.success("Product removed from cart!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to remove product.", { className: "font-[quicksand]", icon: <ToastFaliure /> });
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (isCartUpdating || newQty < 1) return;
    setCount(newQty);
    try {
      await dispatch(
        updateCartItem({ itemId: item._id, data: { quantity: newQty } })
      ).unwrap();
      toast.success("Quantity updated!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to update quantity.", { className: "font-[quicksand]", icon: <ToastFaliure /> });
      setCount(item.quantity);
    }
  };

  const onMinusClick = async () => {
    if (count <= 1) {
      await handleRemove();
    } else {
      setLoadingMinus(true);
      await handleQuantityChange(count - 1);
      setLoadingMinus(false);
    }
  };

  const onPlusClick = async () => {
    setLoadingPlus(true);
    await handleQuantityChange(count + 1);
    setLoadingPlus(false);
  };

  return (
    <>
      <div className="gap-2 sm:gap-4 col-span-2 items-center grid grid-cols-5">
        <div className="relative col-span-2 flex items-center gap-4">
          <img 
            src={product.images?.[0] ?? "/default-image.png"} 
            width={300} 
            height={300} 
            className="object-cover sm:w-[300px] rounded-md w-[50px] h-[auto] aspect-square col-span-1" 
            alt="" 
          />
          <Button 
            disabled={isCartUpdating} 
            className="absolute top-0 translate-x-1/2 -translate-y-1/2 z-10 right-0 h-auto w-auto p-1 rounded-full fill-white bg-red-500 hover:scale-125 transition-all hover:bg-red-500" 
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
          {isCartUpdating && (
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-100/50 rounded-md flex justify-center items-center">
              <Loader2 className="animate-spin stroke-gray-600" />
            </div>
          )}
        </div>
        <div className="flex p-1 sm:p-4 flex-col gap-2 text-sm sm:gap-4 col-span-1">
          <h4 className="text-gray-600">{product.name}</h4>
          {product?.weight && (
            <h4 className="text-gray-600 text-sm">{product.weight.number + product.weight.unit}</h4>
          )}
        </div>
      </div>
      <div className="col-span-1 text-gray-600 flex p-4">{"₹" + product.price}</div>
      <div className="sm:p-4 col-span-1 space-x-2">
        <div className="inline-flex items-center text-xs font-[quicksand] rounded-md justify-between">
          <Button 
            variant="ghost" 
            disabled={count <= 1 || isCartUpdating || loadingMinus} 
            size={"sm"} 
            className="sm:w-auto sm:h-auto sm:p-2" 
            onClick={onMinusClick}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <p className="w-4 flex items-center text-[8px] sm:text-sm justify-center">
            {isCartUpdating ? <Loader2 className="animate-spin w-3 h-3" /> : count}
          </p>
          <Button 
            disabled={isCartUpdating || loadingPlus} 
            variant="ghost" 
            className="w-1 h-1 sm:w-auto sm:h-auto sm:p-2" 
            size={"sm"} 
            onClick={onPlusClick}
          >
            <Plus className="w-1 h-1 sm:w-3 sm:h-3" />
          </Button>
        </div>
      </div>
      <div className="col-span-1 text-gray-600 justify-end flex p-4">
        {isCartUpdating ? <Loader2 className="animate-spin" /> : "₹" + (product.price * count)}
      </div>
    </>
  );
};

export const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const cartTotals = useSelector(selectCartTotals);
  const loading = useSelector(selectCartLoading);

  
  const [orderNote, setOrderNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [localDiscountValue, setLocalDiscountValue] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const currentDiscount = useSelector(selectCurrentDiscount);
  const discountLoading = useSelector(selectDiscountLoading);
  const discountFetchError = useSelector(selectDiscountError);
  
  const shippingCharge = 10; // Rs 10 fixed
  const gstPercent = 0.18; // 18%
  
  const subtotal = cartTotals?.total || 0;
  const discountAmount = localDiscountValue;
  const calcTotalBeforeTax = subtotal - discountAmount;
  const gstAmount = (calcTotalBeforeTax + shippingCharge) * gstPercent;
  const grandTotal = calcTotalBeforeTax + shippingCharge + gstAmount;

  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [dispatch]);

  useEffect(() => {
  if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Clear discount if couponCode is cleared
  useEffect(() => {
    if (!couponCode.trim()) {
      setLocalDiscountValue(0);
      setCouponApplied(false);
      dispatch(clearCurrentDiscount());
    }
  }, [couponCode, dispatch]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    dispatch(getDiscountByCode(couponCode.trim()))
      .unwrap()
      .then((res) => {
        const discount = res.data;
        let amount = 0;
        // Calculate actual discount amount here
        if (discount.discountType === "percentage") {
          amount = subtotal * (discount.value / 100);
          if (discount.maxDiscount) amount = Math.min(amount, discount.maxDiscount);
        } else if (discount.discountType === "fixed") {
          amount = discount.value;
        }
        // You can handle buyXgetY etc. if needed
        setLocalDiscountValue(Math.min(subtotal, Math.floor(amount)));
        setCouponApplied(true);
        toast.success("Coupon applied!");
      })
      .catch((err) => {
        setLocalDiscountValue(0);
        setCouponApplied(false);
        toast.error((err && err.message) || "Invalid coupon code");
      });
  };

  const defaultAddress = user?.addresses.find((a) => a.isDefault) ?? null;

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Checkout initiated");

    if (!user) {
      toast.error("Please login to proceed", { icon: <ToastFaliure /> });
      console.log("User not logged in.");
      return;
    }
    if (!user.phoneNumber) {
      toast.error("Please add your phone number");
      console.log("User phone number missing, redirecting to shipping.");
      navigate("/set-shipping");
      return;
    }
    if (!defaultAddress || !defaultAddress.city) {
      toast.error("Please add your shipping address");
      console.log("User shipping address missing, redirecting to shipping.");
      navigate("/set-shipping");
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderPayload = {
        shippingAddress: {
          ...defaultAddress,
          country: "India",
          phone: user.phoneNumber,
        },
        billingAddress: {
          ...defaultAddress,
          country: "India", 
          phone: user.phoneNumber,
        },
        paymentMethod: "razorpay",
        notes: orderNote,
      };
      console.log("Order payload:", orderPayload);
      // Create order
      const orderRes = await dispatch(createOrder(orderPayload)).unwrap();
      console.log("Order creation response:", orderRes);
      const { orderId } = orderRes.data;
      if (!orderId) throw new Error("Failed to get order ID");
      const paymentRes = await dispatch(
        initiatePayment({ orderId, method: "razorpay" })
      ).unwrap();
      console.log("Payment initiation response:", paymentRes);
      const paymentData = paymentRes.data || paymentRes;
      
      console.log("Received payment data:", paymentData);
      console.log("Razorpay object:", (window as any).Razorpay);
      console.log("Razorpay key:", paymentData?.key);
      console.log("Razorpay order ID:", paymentData?.order.razorpay_order_id);
      if (!paymentData?.key) {
        throw new Error("Invalid payment data");
      }

      console.log("Payment data for Razorpay:", paymentData);

      const order = paymentData.payment;

      if (!paymentData.key || !order) {
        throw new Error("Invalid payment data");
      }
      const options = {
        key: paymentData.key,
        amount: Math.round(order.amount * 100), // in paise
        currency: order.currency || "INR",
        name: "Daadis.in",
        description: `Order #${order.receipt}`,
        image: "/logo.svg",
        order_id: order.razorpayOrderId,
        handler: async (response: RazorpayPaymentData) => {
          console.log("razorpay_order_id:", response.razorpay_order_id);
          console.log("razorpay_payment_id:", response.razorpay_payment_id);
          console.log("razorpay_signature:", response.razorpay_signature);
        try {
          await dispatch(
            handlePaymentSuccess({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          ).unwrap();
          toast.success("Payment successful!");
          await dispatch(clearCart()).unwrap();
          dispatch(fetchProfile());
          navigate("/payment-success");
        } catch (error) {
          const err = error as Error;
          console.error("Payment verification error:", err);
          toast.error(err.message || "Payment verification failed");
        }
      },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: { color: "#BFA6A1" },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            console.log("Payment popup dismissed.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
      });
  
      rzp.open();
    } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unknown error during checkout");
    }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex font-[quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-center flex-col w-full mt-14">
        <Loader2 className="animate-spin w-8 h-8" />
        <p className="mt-2">Loading cart...</p>
      </div>
    );
  }

  return (
    <div id="cart-page" className="flex font-[quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-between py-[5%] flex-col w-full mt-14">
      <h1 className="font-[quicksand] mb-[4%] text-xl">Shopping cart</h1>
      <div className="grid grid-cols-5 px-3 sm:p-6 sm:w-[60%]">
        <div className="col-span-2 mb-4">Product</div>
        <div className="col-span-1">Price</div>
        <div className="col-span-1">Quantity</div>
        <div className="col-span-1 justify-self-end">Total</div>
        {cartItems && (cartItems?.length == 0) && (
          <p className="text-xl font-[quicksand] w-full col-span-full h-[20vh] flex justify-center items-center font-bold">
            Cart empty!!
          </p>
        )}
        <hr className="col-span-5 w-[98%] m-auto mb-4"/>
        {cartItems?.map((cartItem: any, index: number) => {
          return (
            <div key={cartItem._id}>
              <CartItemComponent
                key={cartItem._id}
                item={cartItem}
                userPresent={!!user}
                dispatch={dispatch}
                quantity={cartItem.quantity}
                itemId={cartItem._id}
                product={typeof cartItem.product === "object" ? (cartItem.product as Product) : {} as Product}
              />
              <hr className="col-span-5 mx-auto my-3 w-[95%] self-center text-center" />
            </div>
          )
        })}
    </div>
    <div>
      {/* Coupon Section */}
      <div className="mt-6 mb-4">
        <label htmlFor="coupon" className="block mb-2 font-medium">Coupon Code</label>
        <div className="flex gap-2">
          <input
            id="coupon"
            type="text"
            placeholder="Enter coupon code"
            className="flex-grow border rounded p-2"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={discountLoading}
          />
          <Button onClick={handleApplyCoupon} disabled={discountLoading}>
            {discountLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
        {discountFetchError && <p className="text-red-600 mt-1">{String(discountFetchError)}</p>}
          {couponApplied && currentDiscount && (
            <div className="mt-2 text-green-700 text-sm">
              {currentDiscount.code} coupon applied: {currentDiscount.discountType === "percentage"
                ? `${currentDiscount.value}%`
                : `₹${currentDiscount.value}`} off
            </div>
          )}
      </div>

        {/* Totals Section */}
      <div className="text-right space-y-2 mb-6">
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        {discountAmount > 0 && <div>Discount: -₹{discountAmount.toFixed(2)}</div>}
        <div>Shipping: ₹{shippingCharge.toFixed(2)}</div>
        <div>GST (18%): ₹{gstAmount.toFixed(2)}</div>
        <div className="text-xl font-bold">Total: ₹{grandTotal.toFixed(2)}</div>
      </div>
      </div>
      <div className="mt-6 sm:px-0 px-4 flex items-center font-[quicksand] justify-center gap-4 flex-col">
        <p>Add a note to your order</p>
        <Textarea 
          placeholder="Note" 
          className="resize-none sm:w-96 focus-visible:ring-yellow-500"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
        <p className="text-center">Tax included and shipping calculated at checkout</p>
      </div>
      <Button 
        disabled={checkoutLoading || cartItems.length <= 0} 
        className="mt-4 bg-yellow-500 hover:bg-yellow-700" 
        onClick={handleCheckout}
      >
        {checkoutLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
        Checkout
      </Button>
    </div>
  );
};
function fetchProfile(): any {
  throw new Error("Function not implemented.");
}