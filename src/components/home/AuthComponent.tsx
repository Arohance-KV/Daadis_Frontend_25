import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux1/store";
import { useState } from "react";
import { login, signup } from "../../redux1/authSlice";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });

    const clientid = '176323091300-j5h0a0k0kdf54e2k44hcibvkrguqtip2.apps.googleusercontent.com';
    const redirectUri = 'https://daddis-frontend.vercel.app/auth/google/callback';
    
    const handleGoogleLogin = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientid)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile email`;
        window.location.href = googleAuthUrl;
    };

    const handleLogin = async () => {
  if (!loginData.email || !loginData.password) {
    toast.error("Please fill in all fields");
    return;
  }
  setIsLoading(true);
  try {
    await dispatch(login(loginData)).unwrap();
    navigate("/");
    toast.success("Logged in successfully!");
    closeAuthDialog();
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Login failed";
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};

const handleSignup = async () => {
  if (
    !signupData.firstName ||
    !signupData.lastName ||
    !signupData.email ||
    !signupData.password ||
    !signupData.phoneNumber
  ) {
    toast.error("Please fill in all fields");
    return;
  }
  setIsLoading(true);
  try {
    await dispatch(signup(signupData)).unwrap();
    toast.success("Account created successfully!");
    closeAuthDialog();
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Signup failed";
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div 
                id="auth-component" 
                className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl"
            >
                {/* Close Button */}
                <Button 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full p-0 bg-gray-100/80 hover:bg-red-100 border-0 transition-all duration-200" 
                    variant="ghost" 
                    onClick={(e) => {
                        e.preventDefault();
                        // Replace with your GSAP animation or simple close logic
                        closeAuthDialog();
                    }}
                >
                    <X className="w-4 h-4 text-gray-600 hover:text-red-600 transition-colors" />
                </Button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {tab === "login" ? "Sign in to your account" : "Create your new account"}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-gray-100/70 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => setTab("login")}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                            tab === "login"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setTab("signup")}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                            tab === "signup"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Google Sign In */}
                <Button 
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full mb-6 py-6 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                    <Chrome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                {/* Login Form */}
                {tab === "login" && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <Button 
                            onClick={handleLogin} 
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                )}

                {/* Signup Form */}
                {tab === "signup" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                    value={signupData.firstName}
                                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                    value={signupData.lastName}
                                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                                value={signupData.phoneNumber}
                                onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                            />
                        </div>
                        <Button 
                            onClick={handleSignup} 
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setTab(tab === "login" ? "signup" : "login")}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            {tab === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

function closeAuthDialog() {
    console.log("Close dialog called");
}