import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux1/store";
import { useState } from "react";
import { login, signup } from "../../redux1/authSlice";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [tab, setTab] = useState<"login" | "signup" | "google">("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });

    const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const handleGoogleLogin = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientid}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
        window.location.href = googleAuthUrl;
    };
    const handleLogin = () => {
    dispatch(login(loginData))
      .unwrap()
      .then(() => {
        navigate("/");
        toast.success("Logged in successfully!");
        closeAuthDialog();
      })
      .catch((err) => toast.error(err || "Login failed"));
  };

  const handleSignup = () => {
    dispatch(signup(signupData))
      .unwrap()
      .then(() => {
        toast.success("Account created!");
        closeAuthDialog();
      })
      .catch((err) => toast.error(err || "Signup failed"));
  };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div id="auth-component" className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
                <Button 
                    className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100 transition-colors" 
                    variant="ghost" 
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                    }}
                >
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </Button>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-black mb-2">Welcome</h2>
                    <p className="text-gray-600 text-sm">Please sign in to your account</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                            tab === "login" 
                                ? "bg-white text-black shadow-sm" 
                                : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => setTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                            tab === "signup" 
                                ? "bg-white text-black shadow-sm" 
                                : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => setTab("signup")}
                    >
                        Sign Up
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                            tab === "google" 
                                ? "bg-white text-black shadow-sm" 
                                : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => setTab("google")}
                    >
                        Google
                    </button>
                </div>

                {/* Login Form */}
                {tab === "login" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, password: e.target.value })
                                }
                            />
                        </div>
                        <Button 
                            onClick={handleLogin}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Sign In
                        </Button>
                    </div>
                )}

                {/* Signup Form */}
                {tab === "signup" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    value={signupData.firstName}
                                    onChange={(e) =>
                                        setSignupData({ ...signupData, firstName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    value={signupData.lastName}
                                    onChange={(e) =>
                                        setSignupData({ ...signupData, lastName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                value={signupData.email}
                                onChange={(e) =>
                                    setSignupData({ ...signupData, email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                value={signupData.password}
                                onChange={(e) =>
                                    setSignupData({ ...signupData, password: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                value={signupData.phoneNumber}
                                onChange={(e) =>
                                    setSignupData({ ...signupData, phoneNumber: e.target.value })
                                }
                            />
                        </div>
                        <Button 
                            onClick={handleSignup}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Create Account
                        </Button>
                    </div>
                )}

                {/* Google Login */}
                {tab === "google" && (
                    <div className="text-center space-y-4">
                        <div className="py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-black mb-2">Continue with Google</h3>
                            <p className="text-gray-600 text-sm mb-6">Sign in using your Google account</p>
                        </div>
                        <Button 
                            onClick={handleGoogleLogin} 
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

function closeAuthDialog() {
    throw new Error("Function not implemented.");
}