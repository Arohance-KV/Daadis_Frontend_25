// import { useDispatch, useSelector } from "react-redux";
import { ICartItem, IProduct } from "./constants";
import { setCustomerData } from "../redux/slices/websiteSlice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export const sendEmail = async (email: { from: string, to: string[], subject: string, html: string }) => {
    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}email/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email: email })
        });
    
        const data = await response.json();
        console.log(data);
        return { data };
    } catch (error) {
        console.log(error);
        return { error };
    }
};

export const updateWishList = async ( product: IProduct, isAdd: boolean, currentWishlist: IProduct[], dispatch: Dispatch<UnknownAction>, isUserPresent: boolean, cart?: ICartItem[] ) => {
    
    // const dispatch = useDispatch();
    // const currentWishlist = useSelector((state:any) => state?.website?.customerData?.wishList);
    let newWishList = [ ...currentWishlist, product ];
    
    if ( !isAdd ) {
        newWishList = currentWishlist?.filter((item: IProduct) => item?._id !== product._id);
    } 

    if ( !isUserPresent ) {
        console.log(newWishList);
        localStorage.setItem("wishList", JSON.stringify(newWishList));
        dispatch(setCustomerData({cart : cart, wishList: newWishList}));
        return true;
    }

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-wishlist`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedWishList: newWishList }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const updateCart = async ( cartItem: ICartItem, isAdd: boolean, sameItem: boolean,  currentCart: ICartItem[], dispatch: Dispatch<UnknownAction>, isUserPresent: boolean, wishList?: IProduct[] ) => {

    let newCart;

    if ( isAdd )
        if ( sameItem ) 
            newCart = [ currentCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity + 1 } : item) ];
        else 
            newCart = [ ...currentCart, cartItem ];
    else
        if ( sameItem ) 
            newCart = [ currentCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity - 1 } : item) ];
        else 
            newCart = currentCart?.filter((item: ICartItem) => item?.product?._id !== cartItem?.product?._id);
        
    if ( !isUserPresent ) {
        console.log(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        dispatch(setCustomerData({cart : newCart, wishList: wishList}));
        return true;
    }

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedCart: newCart }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const clearCart = async ( dispatch: Dispatch<UnknownAction>, isUserPresent: boolean) => {

    let newCart;

    if ( !isUserPresent ) {
        console.log(newCart);
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch(setCustomerData({cart : []}));
        return true;
    }

    // console.log(updateCart);

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedCart: [] }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export function optimizeCloudinaryUrl(
  url: string,
) {

  if (!url?.includes("res.cloudinary.com")) return url;

  const [prefix, suffix] = url.split("/upload/");
  const transformations = [
    "f_auto",
    "q_auto",
    // width ? `w_${width}` : null,
    // height ? `h_${height}` : null,
    // "c_fill"
  ]
    .filter(Boolean)
    .join(",");

  return `${prefix}/upload/${transformations}/${suffix}`;
}