import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles } from "lucide-react";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" 
         style={{ 
           background: "linear-gradient(135deg, #FFBDBD 0%, #FFA4A4 25%, #A888B5 75%, #8174A0 100%)"
         }}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
               style={{ backgroundColor: "#FFF2EF" }}>
            <BookOpen className="w-8 h-8" style={{ color: "#CD2C58" }} />
          </div>
          <h1 className="text-5xl font-bold mb-2" 
              style={{ 
                fontFamily: "Outfit, sans-serif",
                color: "#FFF2EF",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}>
            SayEase
          </h1>
          <p className="text-lg" style={{ color: "#FFF2EF" }}>
            Simplify Study & Life
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-2xl" style={{ backgroundColor: "#FFF2EF" }}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center" style={{ fontFamily: "Outfit, sans-serif" }}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Login to continue your study journey" 
                : "Start organizing your student life today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="rounded-xl border-2 focus:border-primary"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-xl border-2 focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="rounded-xl border-2 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                data-testid="button-submit"
                disabled={loading}
                className="w-full rounded-full text-white font-semibold py-6 text-base"
                style={{ backgroundColor: "#CD2C58" }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLogin ? "Logging in..." : "Creating account..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{isLogin ? "Login" : "Sign Up"}</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                data-testid="button-toggle-mode"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium hover:underline"
                style={{ color: "#CD2C58" }}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: "#FFF2EF" }}>
          Your personal digital companion for academic success
        </p>
      </div>
    </div>
  );
}
