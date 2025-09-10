import { useEffect } from "react";
import { MainLayout } from "./components/home/MainLayout";
import "./styles/index.css";
import { useDispatch } from "react-redux";
import { setPartnerBanners, setCategories, setProductData, setTopProducts, setCustomerData, setHeroBanners } from "./redux/slices/websiteSlice";
import { toast } from "sonner";
import { ToastWarning } from "./components/dashboard/productMain/AllProductsTable";
import { useLocation } from "react-router-dom";

export const App = () => {
  
  function ScrollToTop() {
    const location = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]); // Scroll to top on pathname change
  
    return null; // This component doesn't render anything visually
  }

    return (
        <>
          <ScrollToTop />
          <MainLayout />
        </>
    );
};