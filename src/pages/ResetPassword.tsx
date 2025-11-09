import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Lock, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        toast.error("Invalid or expired reset link");
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("Password reset successfully! You can now sign in.");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col relative text-[#eaf0ff]"
      style={{
        backgroundImage: "url('/images/s.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-[#0a0e1a]/40 to-[#0a0e1a]/60 backdrop-blur-[2px]"></div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-soft">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-[#8abaff]/40 shadow-[0_0_25px_rgba(138,186,255,0.3)] mb-4 backdrop-blur-lg">
              <Lock className="h-10 w-10 text-[#a8c8ff] animate-pulse-slow" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#bcd0ff]">
              Reset Your Password
            </h1>
            <p className="text-[#c9d8ff]/90 font-mono text-sm">
              Enter your new password below
            </p>
          </div>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] rounded-xl text-[#eaf0ff]">
            <CardHeader>
              <CardTitle className="text-[#bcd0ff]">New Password</CardTitle>
              <CardDescription className="text-[#d4e0ff]/80">
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#c6d8ff]">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[#c6d8ff]">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#2a62cc]/70 hover:bg-[#3c74dd]/80 text-white shadow-[0_0_20px_rgba(80,130,255,0.4)] hover:shadow-[0_0_35px_rgba(100,150,255,0.5)] transition-all duration-300 rounded-lg font-mono"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
