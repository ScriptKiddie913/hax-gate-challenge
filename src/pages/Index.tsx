import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SCPHeader } from "@/components/SCPHeader";
import { Shield, AlertTriangle, Lock, FileText, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex flex-col matrix-bg">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto relative z-10">
            <SCPHeader 
              classification="THAUMIEL"
              itemNumber="SCP-████"
              title="CAPTURE THE FLAG DIVISION"
            />

            <div className="max-w-5xl mx-auto">
              <div className="scp-paper border-2 border-border p-8 mb-8 scan-line pulse-glow">
                <div className="text-center mb-8 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-primary bg-background mb-6 pulse-glow relative">
                    <Shield className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 border-4 border-primary animate-ping opacity-20"></div>
                  </div>
                  <h2 className="text-5xl font-bold mb-4 scp-header glitch" data-text="SECURE. CONTAIN. PROTECT.">
                    <span className="text-scp-red">SECURE. CONTAIN. PROTECT.</span>
                  </h2>
                  <p className="text-xl mb-2 animate-fade-in-delay">SCP Foundation - CTF Training Division</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    Security Clearance Required | Authorized Personnel Only
                  </p>
                </div>

                <div className="classification-bar my-6"></div>

                <div className="space-y-4 mb-8 animate-fade-in-delay">
                  <p className="text-lg">
                    <strong className="text-primary flicker">NOTICE:</strong> You are accessing a restricted SCP Foundation training environment. 
                    This Capture The Flag (CTF) platform is designed to test and enhance the cybersecurity 
                    capabilities of Foundation personnel.
                  </p>
                  <p>
                    Participants will engage with anomalous digital containment scenarios across multiple 
                    security classifications. Each challenge represents a <span className="redacted">REDACTED</span>
                    {" "}containment breach simulation requiring specialized skills in:
                  </p>
                  <ul className="list-none space-y-2 ml-6">
                    <li className="hover:text-primary transition-colors">• Web Exploitation and System Analysis</li>
                    <li className="hover:text-primary transition-colors">• Cryptographic Protocol Investigation</li>
                    <li className="hover:text-primary transition-colors">• Digital Forensics and <span className="redacted">DATA EXPUNGED</span></li>
                    <li className="hover:text-primary transition-colors">• Reverse Engineering of Anomalous Code</li>
                    <li className="hover:text-primary transition-colors">• Binary Exploitation and Memory Corruption</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center animate-fade-in-delay">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-primary hover:bg-primary/90 glow-red font-mono" 
                    onClick={() => navigate("/auth")}
                  >
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 border-2 font-mono hover:border-primary hover:text-primary transition-all" 
                    onClick={() => navigate("/about")}
                  >
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all group scan-line animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4 group-hover:border-primary group-hover:glow-red transition-all relative">
                    <FileText className="h-10 w-10 group-hover:text-primary transition-colors" />
                    <div className="absolute inset-0 border-3 border-primary opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header group-hover:text-primary transition-colors">CLASSIFIED CHALLENGES</h3>
                  <p className="text-sm text-muted-foreground">
                    Access real-world anomalous scenarios across multiple security classifications: 
                    SAFE, EUCLID, KETER, and beyond.
                  </p>
                </div>

                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all group scan-line animate-fade-in-delay">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4 group-hover:border-destructive group-hover:glow-red transition-all relative">
                    <AlertTriangle className="h-10 w-10 text-destructive group-hover:animate-pulse" />
                    <div className="absolute inset-0 border-3 border-destructive opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header group-hover:text-primary transition-colors">CONTAINMENT PROTOCOLS</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn security clearance points by successfully containing breaches. 
                    Real-time tracking of all containment operations.
                  </p>
                </div>

                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all group scan-line animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4 group-hover:border-success group-hover:glow-red transition-all relative">
                    <Lock className="h-10 w-10 group-hover:text-success transition-colors" />
                    <div className="absolute inset-0 border-3 border-success opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header group-hover:text-primary transition-colors">VERIFIED IDENTITIES</h3>
                  <p className="text-sm text-muted-foreground">
                    All participants undergo blockchain-verified identity confirmation. 
                    Foundation security protocols enforced.
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="border-classified p-8 bg-primary/5 glow-red animate-fade-in-delay">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-12 w-12 text-primary flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-primary scp-header flicker">
                      SECURITY CLEARANCE REQUIRED
                    </h3>
                    <p className="mb-3">
                      Access to this system requires <span className="text-primary font-bold">Level-2</span> security clearance or higher. 
                      Unauthorized access attempts will be logged and reported to <span className="redacted">O5 COMMAND</span>.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      All activities are monitored. By proceeding, you acknowledge adherence to 
                      Foundation Ethics Committee guidelines and containment protocols.
                    </p>
                    
                    <div className="classification-bar mb-4"></div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">THREAT LEVEL:</p>
                        <p className="text-primary font-bold">ELEVATED</p>
                      </div>
                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">STATUS:</p>
                        <p className="text-success font-bold">OPERATIONAL</p>
                      </div>
                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">PARTICIPANTS:</p>
                        <p className="text-foreground font-bold">[CLASSIFIED]</p>
                      </div>
                      <div className="bg-background/50 p-3 border border-border">
                        <p className="text-muted-foreground mb-1">CLEARANCE:</p>
                        <p className="text-destructive font-bold">REQUIRED</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border py-6 px-4 scp-paper">
        <div className="container mx-auto text-center text-sm">
          <div className="classification-bar mb-4 max-w-md mx-auto"></div>
          <p className="font-mono">© 2025 SCP Foundation CTF Division. All Rights Reserved.</p>
          <p className="mt-2 text-muted-foreground">
            Secure Communications: {" "}
            <a href="mailto:sagnik.saha.araptor@gmail.com" className="text-primary hover:underline hover:text-primary-glow transition-colors">
              [ENCRYPTED CHANNEL]
            </a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wider font-mono">
            CLEARANCE LEVEL <span className="redacted text-[8px]">████</span> REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
