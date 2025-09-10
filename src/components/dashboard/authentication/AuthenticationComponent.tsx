// import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
// import { createTheme
    // , IconButton, TextField, ThemeProvider
//  } from "@mui/material";
// import { Button } from "../../ui/button";
// import { yellow } from "@mui/material/colors";
import { useEffect
    // , useState 
} from "react";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { ICartItem } from "../../../utils/constants";
import { setCustomerData } from "../../../redux/slices/websiteSlice";
import { toast } from "sonner";
import { ToastSuccess } from "../productMain/AllProductsTable";
import { optimizeCloudinaryUrl } from "../../../utils/utility-functions";

export const loginFormSchema = z.object({
    email: z.string().email("Invalid email, enter a valid email address!"),
    password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"})
});

// const textFieldTheme = createTheme({
//     components: {
//         MuiTextField: {
//             styleOverrides: {
//                 root: {
//                     "& .MuiInputBase-root" : {
//                         color: `${yellow[600]}`,
//                     },
//                     "& .MuiInputLabel-root" : {
//                         // color: `${yellow[300]}`
//                     },
//                     "& .MuiInputLabel-root.Mui-focused" : {
//                         color: `${yellow[600]}`
//                     },
//                     "& .MuiOutlinedInput-root" : {
//                         "& filedset" : {
//                             borderColor: `${"purple"}`
//                         },
//                         '&:hover fieldset': {
//                             borderColor: `${yellow[500]}`,
//                           },
//                         '&.Mui-focused fieldset': {
//                             borderColor: `${yellow[600]}`,
//                         },
//                         '& .MuiOutlinedInput-input': {
//                             color: `${yellow[600]}`, 
//                         },
//                     },
//                 },
//             }
//         }
//     }
// })

export const mergeCart = (guestCart : ICartItem[], mainCart : ICartItem[]) => {
        
    console.log(`guestCart`, guestCart, `mainCart`, mainCart);

    const mergedCart : ICartItem[] = [ ...mainCart ];

    if ( mainCart?.length == 0 ) {
        guestCart.forEach(cartItem => {
            mergedCart?.push(cartItem);
        })
        return mergedCart;
    }

    const mergedCartLength = mergedCart?.length;

    for (let index = 0; index < guestCart?.length; index++) {
        const guestCartElement = guestCart[index];
        for (let j = 0; j < mergedCartLength; j++) {
            const mergedCartElement = mergedCart[j];
            if ( guestCartElement?.product?._id == mergedCartElement?.product?._id ) {
                mergedCartElement.quantity = ++mergedCartElement.quantity;
                continue;
            } else {
                mergedCart.push(guestCartElement);
            }
        }
        
    }

    console.log(`mergedCart`, mergedCart);
    return mergedCart;
};

export const AuthenticationComponent = ({ type } : { type: string }) => {
    
    // const userData = useSelector((state: any) => state.userData);

    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        (async function verify() {
            try {
                // @ts-ignore
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/current-user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });
                console.log(response);
    
                if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
    
                const data = await response.json(); 
                
                console.log(data.data.role);
                
                if ( type === "dashboard") {
                    if ( data.data?.role !== "Admin"){
                        throw new Error("Unauthorized user!");
                    }
                    dispatch(setUser(data.data));
                    return navigate("/admin/dashboard/home"); 
                }
                if ( type == "home" ) {
                    if ( data.data?.role !== "Admin"){
                        throw new Error("Admins can only access the dashboard!");
                    }
                    dispatch(setUser(data.data));
                    return navigate("/");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        })();        
    }, []);

    // const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    //     resolver: zodResolver(loginFormSchema),
    //     defaultValues: {
    //         email: "",
    //         password: ""
    //     }
    // });

    

    // const [ isLoginButtonLoading, setIsLoginButtonLoading ] = useState(false);

    // const onLoginFormSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    //     console.log(values);
    //     setIsLoginButtonLoading(true);
    //     try {
    //         // @ts-ignore
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/login`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: 'include',
    //             body: JSON.stringify({email: values.email, password: values.password})
    //         });

    //         if (!response.ok) {
    //             const errData = await response.json();
    //             loginForm.setError(errData.errors[0].type, {type: "manual", message: errData.errors[0].errMsg})
    //             throw new Error("HTTP error! status: "+response.status);
    //         }

    //         console.log(response);
            
    //         const data = await response.json();

    //         if ( data.data.user.role !== "Admin" ) {
    //             loginForm.setError("email", { type: "manual", message: "Unauthorized user!"})
    //             throw new Error("Unauthorized user");
    //         }
            
    //         dispatch(setUser(data.data.user));
    //         navigate("/admin/dashboard/home");
            
    //         console.log(data);
    //     } catch (error) {
    //         console.error("Error: ", error);
    //     }
    //     setIsLoginButtonLoading(false);
    // };

    // const [ showPassword, setShowPassword ] = useState(false);


    // const handleClickShowPassword = () => setShowPassword((show) => !show);


    // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    //   event.preventDefault();
    // };

    return (
        <div className={cn(`w-full font-[quicksand] flex justify-center items-center`, (type === "dashboard") && "h-screen")}>
            <div className="rounded-lg gap-4 flex flex-col justify-center items-center shadow-lg bg-gray-100 text-center w-[400px] p-[5%]">
                <img src={optimizeCloudinaryUrl("/logo.svg")} className="w-[80px]"/>
                <h1>Continue with google!</h1>
                <div className="w-full" >
                    <GoogleLogin shape="circle" onSuccess={ async (credintialResponse) => {
                    try {
                        console.log(credintialResponse);
                        // @ts-ignore
                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/google/login`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include',
                            body: JSON.stringify({ token: credintialResponse?.credential })
                        });
                
                        if (!response.ok) {
                            console.log(response)
                            throw new Error("HTTP error! status: "+response.status);
                        }
                
                        console.log(response);
                        
                        const data = await response.json();
                        
                        console.log(data);

                        const guestCart = JSON.parse(localStorage.getItem('cart')!);
                        // const guestVideoCallCart = JSON.parse(localStorage.getItem('videoCallCart')!);
                        // const guestWishList = JSON.parse(localStorage.getItem('wishList')!);

                        console.log(guestCart, guestCart?.length);

                        const mergedCart = mergeCart(guestCart, data?.data?.user?.cart);

                        // @ts-ignore
                        const updateCartResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ updatedCart: mergedCart }),
                            credentials: "include"
                        });

                        console.log(updateCartResponse);

                        if (!updateCartResponse.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                        
                        const updateCartData = await updateCartResponse.json();

                        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
                        // dispatch(setCustomerData(updateCartData.data));
                        console.log(updateCartData);
                        // return true;
                        // guestWishList.forEach((item : IWishListItem) => {
                        //     if ( guestWishList?.filter((wishListItem : IWishListItem) => wishListItem?.product?._id == item?.product?._id)?.length > 0 )
                        //         return
                        //     updateWishList(item, true, data?.data?.user?.wishList, dispatch, true, data?.data?.user?.cart, data?.data?.user?.videoCallCart);
                        // });

                        // guestVideoCallCart.forEach((item : ICartItem) => {
                        //     if ( guestVideoCallCart?.filter((cartItem : ICartItem) => cartItem?.product?._id == item?.product?._id)?.length > 0 )
                        //         return;
                        //     updateVideoCallCart(item, true, false, data?.data?.user?.cart, dispatch, true, data?.data?.user?.videoCallCart, data?.data?.user?.wishList);
                        // });

                        // const currentUserResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/current-user`, {
                        //     method: "GET",
                        //     headers: {
                        //         "Content-Type": "application/json",
                        //     },
                            // credentials: "include"
                        // });
                        // console.log(currentUserResponse);
              
                        // if (!currentUserResponse.ok) {
                        //   if ( currentUserResponse.statusText == "Unauthorized" || currentUserResponse.status == 401 ) {
                            // console.log(await createGuestUser());
                        //   }
                        //   throw new Error("HTTP error! status: "+currentUserResponse.status+", "+currentUserResponse.statusText);
                        // }
                        // const currentUserData = await currentUserResponse.json();
              
                        // console.log("currentUserData?.data: ", currentUserData?.data, "data?.data: ", data?.data);
              
                        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
                        // dispatch(setCustomerData(currentUserData.data));
              
                        dispatch(setCustomerData({ ...data?.data?.user, cart: updateCartData?.data?.cart }));
                        toast.success("Logged In successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
                        navigate("/");

                    } catch (error) {
                        console.log(error);
                    }
                }}/>
                    {/* <Form {...loginForm}>
                        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}>
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => {
                                    return <FormItem className="flex w-full justify-center gap-4 items-center flex-col">
                                        <FormControl className="">
                                            <ThemeProvider theme={textFieldTheme}>
                                                <TextField {...field} fullWidth size="small" label="Email" variant="outlined" className="" />
                                            </ThemeProvider>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>;
                                }}
                            />
                            <FormField
                                name="password"
                                control={loginForm.control}
                                render={({ field }) => {
                                    return <FormItem className="flex w-full justify-center gap-4 items-center flex-col">
                                        <FormControl className="p-0 m-0">
                                            <ThemeProvider theme={textFieldTheme}>
                                                <TextField {...field} InputProps={{
                                                    endAdornment: <IconButton onClick={handleClickShowPassword}>{showPassword ? <Eye className="w-4 h-4"/> : <EyeOff  className="w-4 h-4"/>}</IconButton>
                                                }} type={showPassword ? "text" : "password"}  fullWidth size="small" label="Password" variant="outlined" className="" />
                                            </ThemeProvider>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>    
                                }}
                            />
                            <Button disabled={isLoginButtonLoading} className="mt-4 w-16 bg-yellow-100 text-yellow-300 hover:text-yellow-500 hover:bg-yellow-300" variant={"ghost"} type="submit">{isLoginButtonLoading ? <Loader2 className="animate-spin" /> : "Login"}</Button> 
                        </form>
                    </Form> */}
                </div>
            </div>
        </div>
    );
};