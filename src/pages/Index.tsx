import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SCPHeader } from "@/components/SCPHeader";
import { Shield, AlertTriangle, Lock, FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <SCPHeader 
              classification="THAUMIEL"
              itemNumber="SCP-████"
              title="CAPTURE THE FLAG DIVISION"
            />

            <div className="max-w-5xl mx-auto">
              <div className="scp-paper border-2 border-border p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-primary bg-background mb-6">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 scp-header">
                    <span className="text-scp-red">SECURE. CONTAIN. PROTECT.</span>
                  </h2>
                  <p className="text-xl mb-2">SCP Foundation - CTF Training Division</p>
                  <p className="text-muted-foreground">
                    Security Clearance Required | Authorized Personnel Only
                  </p>
                </div>

                <div className="classification-bar my-6"></div>

                <div className="space-y-4 mb-8">
                  <p className="text-lg">
                    <strong>NOTICE:</strong> You are accessing a restricted SCP Foundation training environment. 
                    This Capture The Flag (CTF) platform is designed to test and enhance the cybersecurity 
                    capabilities of Foundation personnel.
                  </p>
                  <p>
                    Participants will engage with anomalous digital containment scenarios across multiple 
                    security classifications. Each challenge represents a <span className="redacted">REDACTED</span> 
                    {" "}containment breach simulation requiring specialized skills in:
                  </p>
                  <ul className="list-none space-y-2 ml-6">
                    <li>• Web Exploitation and System Analysis</li>
                    <li>• Cryptographic Protocol Investigation</li>
                    <li>• Digital Forensics and <span className="redacted">DATA EXPUNGED</span></li>
                    <li>• Reverse Engineering of Anomalous Code</li>
                    <li>• Binary Exploitation and Memory Corruption</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => navigate("/auth")}>
                    REQUEST CLEARANCE
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate("/about")}>
                    VIEW DOCUMENTATION
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4">
                    <FileText className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header">CLASSIFIED CHALLENGES</h3>
                  <p className="text-sm text-muted-foreground">
                    Access real-world anomalous scenarios across multiple security classifications: 
                    SAFE, EUCLID, KETER, and beyond.
                  </p>
                </div>

                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header">CONTAINMENT PROTOCOLS</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn security clearance points by successfully containing breaches. 
                    Real-time tracking of all containment operations.
                  </p>
                </div>

                <div className="scp-paper border-2 border-border p-6 text-center hover:border-primary transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-accent bg-background mb-4">
                    <Lock className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 scp-header">VERIFIED IDENTITIES</h3>
                  <p className="text-sm text-muted-foreground">
                    All participants undergo blockchain-verified identity confirmation. 
                    Foundation security protocols enforced.
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="border-classified p-6 bg-destructive/5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-destructive scp-header">
                      SECURITY CLEARANCE REQUIRED
                    </h3>
                    <p className="mb-4">
                      Access to this system requires Level-2 security clearance or higher. 
                      Unauthorized access attempts will be logged and reported to O5 Command.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All activities are monitored. By proceeding, you acknowledge adherence to 
                      Foundation Ethics Committee guidelines and containment protocols.
                    </p>
                    <div className="mt-4">
                      <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => navigate("/auth")}>
                        INITIATE SECURITY CLEARANCE
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification Legend */}
              <div className="mt-8 scp-paper border border-border p-6">
                <h3 className="text-lg font-bold mb-4 scp-header">OBJECT CLASS REFERENCE:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
                  <div>
                    <Badge variant="outline" className="bg-success/20 text-success border-success w-full">SAFE</Badge>
                    <p className="text-xs mt-2 text-muted-foreground">Easily Contained</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-yellow-600/20 text-yellow-700 border-yellow-700 w-full">EUCLID</Badge>
                    <p className="text-xs mt-2 text-muted-foreground">Unpredictable</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive w-full">KETER</Badge>
                    <p className="text-xs mt-2 text-muted-foreground">Highly Dangerous</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-purple-600/20 text-purple-700 border-purple-700 w-full">THAUMIEL</Badge>
                    <p className="text-xs mt-2 text-muted-foreground">Top Secret</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-black/90 text-white border-black w-full">APOLLYON</Badge>
                    <p className="text-xs mt-2 text-muted-foreground">World-Ending</p>
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
            <a href="mailto:sagnik.saha.araptor@gmail.com" className="text-primary hover:underline">
              [ENCRYPTED CHANNEL]
            </a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
            CLEARANCE LEVEL ████ REQUIRED | UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
