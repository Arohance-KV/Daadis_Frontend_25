import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { App } from "./App";
// import { ErrorPage } from "./components/Errorpages/Error";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { DashboardFront } from "./components/dashboard/dashboardMain/DashboardFront";
import { ProductContent } from "./components/dashboard/productMain/ProductContent";
import { CustomerContent } from "./components/dashboard/customerMain/CustomerContent";
import { CouponContent } from "./components/dashboard/couponMain/CouponContent";
import { AnalyticsContent } from "./components/dashboard/analyticsMain/AnalyticsContent";
import { DeliveryContent } from "./components/dashboard/deliveryMain/DeliveryContent";
import { MarketingContent } from "./components/dashboard/marketingMain/MarketingContent";
import { EmailPage } from "./components/dashboard/marketingMain/EmailPage";
// import { LuckyPoints } from "./components/dashboard/marketingMain/LuckyPoints";
import { BannersPage } from "./components/dashboard/marketingMain/BannersPage";
import { Provider } from "react-redux";
import { store } from "./redux1/store";
import { AuthenticationComponent } from "./components/dashboard/authentication/AuthenticationComponent";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./components/home/HomePage";
import { WishListPage } from "./components/home/WishListPage";
import { ProductPage } from "./components/home/ProductPage";
import { Cart } from "./components/home/Cart";
import { CategoriesPage } from "./components/home/CategoriesPage";
import { ContactPage } from "./components/home/ContactPage";
import { AllProducts } from "./components/home/AllProducts";
import AboutUs from "./components/home/AboutUs";
import { BlogPage } from "./components/home/Blog";
import { Expandedblog } from "./components/home/ExpandedBlog";
import { FAQs, PrivacyPolicy, TermsAndConditions } from "./components/home/QuickLinks";
import { AccountDetails } from "./components/home/AccountDetails";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SetShipping } from "./components/home/SetShipping";
import { PaymentSuccess } from "./components/home/PaymentSuccess";
import  GoogleCallback  from "./components/home/GoogleCallback";
// import { ProductPage } from "./components/home/ProductsPage";

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <App/ >,
//         errorElement: <ErrorPage />
//     },
//     {
//         path: "admin/",
//         element: <DashboardHome />,
//         errorElement: <ErrorPage />
//     }
// ]);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route path="auth/google/callback" element={<GoogleCallback />} />
            <Route path="admin">
                <Route path="" ></Route>
                <Route path="auth" element={<AuthenticationComponent type={"dashboard"} />} ></Route>
                <Route path="dashboard" element={<DashboardHome />}>
                    <Route path="home" element={<DashboardFront />}></Route>
                    <Route path="products" element={<ProductContent />}></Route>
                    <Route path="customers" element={<CustomerContent />}></Route>
                    <Route path="coupons" element={<CouponContent />}></Route>
                    <Route path="analytics" element={<AnalyticsContent />}></Route>
                    <Route path="delivery" element={<DeliveryContent />}></Route>
                    <Route path="marketing" element={<MarketingContent />}>
                    </Route>
                    <Route path="marketing/emails" element={<EmailPage />}></Route>
                    <Route path="marketing/lucky-points"></Route>
                    <Route path="marketing/banners" element={<BannersPage />}></Route>
                </Route>
            </Route>
            <Route path="" element={<App />}>
                <Route path="" element={<HomePage />} />
                <Route path="set-shipping" element={<SetShipping />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="account-details" element={<AccountDetails />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="faq" element={<FAQs />} />
                <Route path="wishlist" element={<WishListPage />} />
                <Route path="cart" element={<Cart />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="category/:name" element={<CategoriesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="all-products" element={<AllProducts />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:blogId" element={<Expandedblog />} />
            </Route>
        </Route>
    )
);

// @ts-ignore
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <RouterProvider router={router} />
                <Toaster />
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);