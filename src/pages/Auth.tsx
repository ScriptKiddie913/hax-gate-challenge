import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Flag, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        toast.error("Username already taken");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username: username },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Check your email for verification link!");
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          toast.error("Please verify your email before logging in");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        toast.success("Signed in successfully!");
        navigate("/challenges");
      }
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
    } finally {
      setLoading(false);
    }
  };

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
      {/* Gradient overlay for consistency */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-[#0a0e1a]/40 to-[#0a0e1a]/60 backdrop-blur-[2px]"></div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-soft">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-[#8abaff]/40 shadow-[0_0_25px_rgba(138,186,255,0.3)] mb-4 backdrop-blur-lg">
              <Flag className="h-10 w-10 text-[#a8c8ff] animate-pulse-slow" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#bcd0ff]">
              Welcome to{" "}
              <span className="text-[#9fc3ff] font-bold">HaxGate CTF</span>
            </h1>
            <p className="text-[#c9d8ff]/90 font-mono text-sm">
              Enter the gate. Capture the flags.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-md border border-white/10 text-[#dce6ff]">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-[#2a62cc]/60 data-[state=active]:text-white transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#2a62cc]/60 data-[state=active]:text-white transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] rounded-xl text-[#eaf0ff]">
                <CardHeader>
                  <CardTitle className="text-[#bcd0ff]">Sign In</CardTitle>
                  <CardDescription className="text-[#d4e0ff]/80">
                    Access your account to continue your journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-[#c6d8ff]">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-[#c6d8ff]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#2a62cc]/70 hover:bg-[#3c74dd]/80 text-white shadow-[0_0_20px_rgba(80,130,255,0.4)] hover:shadow-[0_0_35px_rgba(100,150,255,0.5)] transition-all duration-300 rounded-lg font-mono"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] rounded-xl text-[#eaf0ff]">
                <CardHeader>
                  <CardTitle className="text-[#bcd0ff]">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-[#d4e0ff]/80">
                    Join the challenge and prove your skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-username"
                        className="text-[#c6d8ff]"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                        <Input
                          id="signup-username"
                          type="text"
                          placeholder="hacker123"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="pl-10 font-mono bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-[#c6d8ff]">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 bg-white/5 border border-white/10 text-[#f0f5ff] placeholder:text-[#cbd8ff]/40"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-[#c6d8ff]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[#bcd0ff]/70" />
                        <Input
                          id="signup-password"
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
                    <Button
                      type="submit"
                      className="w-full bg-[#2a62cc]/70 hover:bg-[#3c74dd]/80 text-white shadow-[0_0_20px_rgba(80,130,255,0.4)] hover:shadow-[0_0_35px_rgba(100,150,255,0.5)] transition-all duration-300 rounded-lg font-mono"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-[#cbd8ff]/70 text-center font-mono">
                      You'll receive a verification email after signing up
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
