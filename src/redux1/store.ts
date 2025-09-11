import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import categorySliceReducer from "./categorySlice";
import productSliceReducer from "./productSlice";
import orderSliceReducer from "./orderSlice";
import wishlistSliceReducer from "./wishlistSlice";
import discountSliceReducer from "./discountSlice";
import cartSliceReducer from "./cartSlice";
import paymentSliceReducer from "./paymentSlice";
import blogSliceReducer from "./blogSlice";
export const store = configureStore({
    reducer: combineReducers({ 
        cart: cartSliceReducer,
        auth: authSliceReducer,
        category: categorySliceReducer,
        product: productSliceReducer,
        order: orderSliceReducer,
        wishlist: wishlistSliceReducer,
        discount: discountSliceReducer,
        payment: paymentSliceReducer,
        blogs: blogSliceReducer,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;