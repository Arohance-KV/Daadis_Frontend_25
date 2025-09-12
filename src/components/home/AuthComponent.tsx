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

    const clientid = '176323091300-j5h0a0k0kdf54e2k44hcibvkrguqtip2.apps.googleusercontent.com';
    const redirectUri = 'https://daddis-frontend.vercel.app/auth/google/callback';
    console.log("Client ID:", clientid);
    console.log("Redirect URI:", redirectUri);
    const handleGoogleLogin = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientid)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile email`;
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
        // <div className={cn(`w-full font-[quicksand] flex justify-center items-center`)}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div id="auth-component" className="rounded-lg relative shadow-xl sm:m-0 m-8 gap-4 flex flex-col justify-center items-center bg-gray-100 text-center z-[1000] w-[400px] p-[3%]">
                <Button className="absolute top-4 h-auto rounded-full p-0 right-4" variant={"ghost"} onClick={(e) => {
                    e.preventDefault();
                    gsap.to("#auth-component", {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            gsap.to("#auth-component", {
                                display: "none",
                                duration: 0,
                            });
                        }
                    });
                }} ><X className="w-6 h-6 p-1 border hover:stroke-white hover:bg-yellow-300 transition-all border-yellow-300 stroke-gray-500 rounded-full" /></Button>
                <div className="flex justify-center gap-4 mb-4">
                 <Button
                   variant={tab === "login" ? "default" : "ghost"}
                   onClick={() => setTab("login")}
                 >
                   Login
                 </Button>
                 <Button
                   variant={tab === "signup" ? "default" : "ghost"}
                   onClick={() => setTab("signup")}
                 >
                   Sign Up
                 </Button>
                 <Button
                   variant={tab === "google" ? "default" : "ghost"}
                   onClick={() => setTab("google")}
                 >
                   Google Log in
                 </Button>
                </div>
                {tab === "login" && (
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Email"
                      className="border p-2 rounded"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="border p-2 rounded"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                    />
                    <Button onClick={handleLogin}>Login</Button>
                  </div>
                )}
          
                {tab === "signup" && (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border p-2 rounded"
                      value={signupData.firstName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="border p-2 rounded"
                      value={signupData.lastName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, lastName: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="border p-2 rounded"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="border p-2 rounded"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="border p-2 rounded"
                      value={signupData.phoneNumber}
                      onChange={(e) =>
                        setSignupData({ ...signupData, phoneNumber: e.target.value })
                      }
                    />
                    <Button onClick={handleSignup}>Sign Up</Button>
                  </div>
                )}
                {tab === "google" && (
                  <div className="flex justify-center">
                    <Button onClick={handleGoogleLogin} className="bg-red-500 hover:bg-red-600 text-white">
                      Continue with Google
                    </Button>
                  </div>
                )}
                </div>
            </div>
        // {/* </div> */}
    );
};

function closeAuthDialog() {
    throw new Error("Function not implemented.");
}
