import { Link, 
    useNavigate
 } from "react-router-dom";
import { Button } from "../ui/button";
import { CircleHelp,
    // Eye, EyeOff,
     Headset, HeartCrack, HomeIcon,
    //   Loader2,
      LoaderCircle, LogIn, LucideHeart,
    //    Settings,
        ShoppingCart, Store, UserCircle2, Rss  } from "lucide-react";
import { useEffect, useRef, useState} from "react";
// import { yellow } from "@mui/material/colors";
import { Avatar
    // , createTheme, IconButton, TextField, ThemeProvider 
} from "@mui/material";
// import { z } from "zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Squash as Hamburger } from 'hamburger-react';
import { slide as Menu } from 'react-burger-menu';
import { getProfile, User } from "../../redux1/authSlice";
// import Cookies from "js-cookie";
import { Badge } from "../ui/badge";
// import { updateCart, updateWishList } from "../../utils/utility-functions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { AppDispatch, RootState } from "../../redux1/store";
import { Category } from "../../redux1/categorySlice";
import { Product } from "../../redux1/productSlice";
import { CartItem } from "../../redux1/cartSlice";
import { WishlistItem } from "../../redux1/wishlistSlice";
import { AuthComponent } from "./AuthComponent";



export const HomePageNavBar = () => {

    const categories = useSelector<RootState, Category[]>(
      (state) => state.category.categories
    );
    const productDataFromStore = useSelector<RootState, Product[]>(
      (state) => state.product.products
    );
    const customerData = useSelector<RootState, User | null>(
      (state) => state.auth.user
    );
    // Select cart items and wishlist items from respective slices
    const cartItems = useSelector<RootState, CartItem[]>(
      (state) => state.cart.items
    );
    const wishlistItems = useSelector<RootState, WishlistItem[]>(
      (state) => state.wishlist.items
    );
    // Use local state for wishlist and cart count display
    const [, setCurrentWishList] = useState<Product[]>(
      wishlistItems?.map((item) => {
        // item.product can be a string or object, handle both cases, if only productId string is stored,
        // map to product data if needed or leave placeholder
        if (typeof item.product === "object") return item.product as Product;
        return null; // or map from productDataFromStore by id if possible
      }).filter(Boolean) as Product[]
    );
    const [currentCart, setCurrentCart] = useState<CartItem[]>(cartItems || []);
    const productDropMenuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
    // Update current wishlist and cart from redux state on changes
    setCurrentWishList(
      wishlistItems?.map((item) =>
        typeof item.product === "object" ? (item.product as Product) : null
      ).filter(Boolean) as Product[]
    );
    setCurrentCart(cartItems || []);
  }, [wishlistItems, cartItems]);

    const [ isProductPageVisible, setIsProductPageVisible ] = useState(false);
    const [ isHamburgerMenuOpen, setIsHamburgerMenuOpen ] = useState(false);

    const [ ] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const loading = useSelector((state: RootState) => state.auth.profileLoading);

    useEffect(() => {
    if (!user) dispatch(getProfile());
  }, [dispatch, user]);

    const [] = useState(false);

    return (
        <div className="z-[100] font-[quicksand] bg-white scroll-smooth w-full top-0 fixed justify-center items-center flex h-14">
            <section id="auth-component" className="opacity-0 z-[100] hidden absolute top-0 left-0 right-0 h-screen justify-center items-center bottom-0">
                <AuthComponent />
            </section>
            <div className="sm:flex hidden justify-evenly font-[quicksand] gap-4 items-center flex-1">
    <Link to={"/"} className="text-sm capitalize font-[quicksand] transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
        HOME
    </Link>

    <Link to={"/about-us"} className="text-sm capitalize font-[quicksand] transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
        ABOUT
    </Link>
    
    {/* Products dropdown with hover functionality */}
    <div 
        className="relative"
        onMouseEnter={() => setIsProductPageVisible(true)}
        onMouseLeave={() => setIsProductPageVisible(false)}
    >
        <Link 
            to="/category/all" 
            className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm"
        >
            PRODUCTS
        </Link>
        
        {isProductPageVisible && (
            <div 
                ref={productDropMenuRef} 
                className="absolute p-6 gap-6 flex flex-col max-h-[500px] flex-wrap rounded-lg w-[600px] top-full left-0 bg-white shadow-xl border border-gray-200 z-50"
                onMouseEnter={() => setIsProductPageVisible(true)}
                onMouseLeave={() => setIsProductPageVisible(false)}
            >
                {categories?.map((category, categoryIndex) => {
                    return (
                        <div key={categoryIndex} className="text-left min-w-[180px]">
                            <span className="capitalize font-bold text-gray-800 text-sm mb-2 block border-b border-gray-200 pb-1">
                                {category.name}
                            </span>
                            <ul className="space-y-1">
                                {productDataFromStore
                                    ?.filter((product) => product.category === category._id)
                                    ?.map((product, productIndex) => (
                                        <li key={productIndex}>
                                            <Link 
                                                to={`/product/${product._id}`} 
                                                className="text-gray-600 hover:text-gray-800 text-xs transition-colors duration-150 hover:bg-gray-50 block py-1 px-2 rounded"
                                                onClick={() => setIsProductPageVisible(false)}
                                            >
                                                {product.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    );
                })}
            </div>
        )}
    </div>

    <Link to={"/blog"} className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
        BLOG
    </Link>
    
    <Link className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm" to={"/contact"}>
        CONTACT
    </Link>
</div>
            <div className="sm:hidden block">
                <Hamburger toggled={isHamburgerMenuOpen} size={24} onToggle={() => {
                    // e.preventDefault();
                    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
                }}/>
                <Menu className="bg-cyan-300" onClose={() => {
                    setIsHamburgerMenuOpen(false);
                }} width={"100vw"} customBurgerIcon={false} customCrossIcon={false} isOpen={isHamburgerMenuOpen}>
                    <div className="w-full h-[75%] gap-4" style={{
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"flex-start"
                    }}>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <HomeIcon />
                                {/* <span className="bg-purple-600"> */}
                                    HOME
                                {/* </span> */}
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/category/all"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Store />
                                {/* <span className="bg-purple-600"> */}
                                    PRODUCTS
                                {/* </span> */}
                            </div>
                        </Link>
                        <Link onClick={()=>{
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/about-us"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <CircleHelp />
                                {/* <span className="bg-purple-600"> */}
                                    ABOUT
                                {/* </span> */}
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/contact"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Headset />
                                {/* <span className="bg-purple-600"> */}
                                    CONTACT
                                {/* </span> */}
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/blog"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Rss />
                                {/* <span className="bg-purple-600"> */}
                                    BLOGS
                                {/* </span> */}
                            </div>
                        </Link>
                    </div>
                    <div className="items-center gap-4 font-bold text-[20px] p-5 my-[10px] flex">
                        <p className="text-[15px]">Socials</p>
                        <a href="https://www.instagram.com/daadis.in?igsh=MTg2aWx1M2o1d2c2bQ==">Instagram</a>
                    </div>
                </Menu>
            </div>
            {/* <Link className="m-auto bg-blue-600 items-end flex-1 sm:flex-none flex justify-end" to={"/"}> */}
            <Link className="ml-[100px]" to={"/"}>
                <img className="h-20" src="/logo.svg" />
            </Link>
            <div className="justify-between gap-4 items-center flex flex-1">
                {/* <div className="relative w-[60%] ml-16 hidden lg:block self-end justify-self-end bg-blue-500">
                    <Input placeholder={"search"} className="pl-8" />
                    <LucideSearch className="absolute top-[50%] w-4 h-4 translate-y-[-50%] left-2" />
                </div> */}
                <div className="flex-1 flex justify-end mr-4 gap-4 items-center">
                    <Link to={"/wishlist"} onClick={() => {
                        {console.log(customerData)}
                    }} className="transition-all z-[0] hover:scale-125 duration-250 hover:fill-red-500 relative">
                        {wishlistItems?.length == 0? (<HeartCrack className="transition-all"/>) : (<LucideHeart className="fill-red-500 stroke-red-500 transition-all"/>)}
                        <Badge className="absolute z-0 right-[-25%] top-[-25%] text-[10px] rounded-full px-1 py-0" variant={"secondary"}>{wishlistItems?.length}</Badge>
                    </Link>
                    
                    {/* Modified user profile section */}
                    {!user ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost">
                            <UserCircle2 className="w-8 h-8" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" sideOffset={8} className="p-4 w-64">
                          <Button onClick={() => navigate('/auth')}>
                            <LogIn className="mr-2" /> Login / Sign Up
                          </Button>
                        </PopoverContent>
                      </Popover>
                    ) : loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/profile')}
                        className="p-2"
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.firstName.charAt(0)}
                        </Avatar>
                      </Button>
                    )}

                    <Link to={"/cart"} className="flex gap-4 items-center justify-center relative">
                        <Button className="flex gap-4 items-center justify-center relative">
                            <ShoppingCart />
                            <span className="sm:block hidden">Cart</span>
                            <Badge className="absolute right-[-8%] top-[-18%] rounded-full px-1 py-0" variant={"secondary"}>{currentCart?.length}</Badge>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};