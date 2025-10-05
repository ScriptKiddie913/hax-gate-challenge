import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Flag, Trophy, Target, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user.email_confirmed_at) {
      navigate("/challenges");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 mb-8 animate-pulse shadow-lg shadow-primary/20">
                <Flag className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
                Welcome to <span className="text-gradient-cyan glow-text">HaxGate CTF</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Test your cybersecurity skills, solve challenges, and compete with hackers worldwide. 
                Enter the gate. Capture the flags. Prove your worth.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" className="glow-cyan gap-2 text-lg px-8 py-6" onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="h-6 w-6" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10" onClick={() => navigate("/about")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-gradient-cyan">HaxGate</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center p-8 rounded-xl border border-border bg-card/80 backdrop-blur-xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-World Challenges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tackle challenges across web exploitation, cryptography, reverse engineering, and more. Real scenarios, real learning.
                </p>
              </div>

              <div className="group text-center p-8 rounded-xl border border-border bg-card/80 backdrop-blur-xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Live Scoreboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Earn points for solving challenges and climb the real-time leaderboard. Watch your ranking update instantly!
                </p>
              </div>

              <div className="group text-center p-8 rounded-xl border border-border bg-card/80 backdrop-blur-xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practice hacking skills legally and ethically with blockchain-verified identities in a secure environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-xl shadow-2xl shadow-primary/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 mb-6">
                <Flag className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Accept the Challenge?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join our community of cybersecurity enthusiasts and start your journey today. Your blockchain-verified identity awaits.
              </p>
              <Button size="lg" className="glow-cyan gap-2 text-lg px-10 py-7 shadow-lg shadow-primary/30" onClick={() => navigate("/auth")}>
                Create Account
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 HaxGate CTF. All rights reserved.</p>
          <p className="mt-2">
            Questions? Contact us at{" "}
            <a href="mailto:sagnik.saha.araptor@gmail.com" className="text-primary hover:text-primary-glow transition-colors">
              sagnik.saha.araptor@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
