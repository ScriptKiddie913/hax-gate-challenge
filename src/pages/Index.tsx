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
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-10"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-6">
                <Flag className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to <span className="text-gradient-cyan">HaxGate CTF</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Test your cybersecurity skills, solve challenges, and compete with hackers worldwide. 
                Enter the gate. Capture the flags. Prove your worth.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="glow-cyan gap-2" onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-World Challenges</h3>
                <p className="text-muted-foreground">
                  Tackle challenges across web exploitation, cryptography, reverse engineering, and more
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Competitive Scoring</h3>
                <p className="text-muted-foreground">
                  Earn points for solving challenges and climb the real-time leaderboard
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Safe Learning Environment</h3>
                <p className="text-muted-foreground">
                  Practice hacking skills legally and ethically in a controlled setting
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center p-8 rounded-lg border border-primary/30 bg-primary/5 backdrop-blur">
              <h2 className="text-3xl font-bold mb-4">Ready to Accept the Challenge?</h2>
              <p className="text-muted-foreground mb-6">
                Join our community of cybersecurity enthusiasts and start your journey today
              </p>
              <Button size="lg" className="glow-cyan gap-2" onClick={() => navigate("/auth")}>
                Create Account
                <ArrowRight className="h-5 w-5" />
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
