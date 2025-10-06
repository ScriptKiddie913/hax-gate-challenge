import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, Target, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              About <span className="text-gradient-cyan">SecureContainProtect CTF</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A platform for cybersecurity enthusiasts to test and improve their hacking skills
            </p>
          </div>

          {/* Our Mission */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SecureContainProtect CTF is a cybersecurity challenge platform designed to provide hands‑on experience
                with real‑world hacking scenarios in a safe, legal environment. Our goal is to foster
                learning and skill development within the cybersecurity community.
              </p>
              <p>
                Whether you're a beginner looking to learn the basics or an experienced hacker seeking
                to sharpen your skills, SecureContainProtect CTF offers challenges across multiple categories including
                web exploitation, cryptography, reverse engineering, forensics, and more.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Create an Account</h3>
                    <p className="text-muted-foreground">
                      Sign up with your email and choose a unique username that will appear on the scoreboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Verify Your Email</h3>
                    <p className="text-muted-foreground">
                      Check your inbox and verify your email address to unlock access to all challenges.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Solve Challenges</h3>
                    <p className="text-muted-foreground">
                      Browse available challenges, read descriptions, download files, and find the hidden flags.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Submit Flags & Earn Points</h3>
                    <p className="text-muted-foreground">
                      Once you find a flag, submit it to earn points. First correct submission locks the challenge.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Compete on the Scoreboard</h3>
                    <p className="text-muted-foreground">
                      Track your progress and compete with others on the real‑time scoreboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community & Support */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Join our growing community of cybersecurity enthusiasts. Share knowledge, collaborate
                on challenges, and help each other improve.
              </p>
              <p>
                For questions, suggestions, or support, please contact us at:
                <a
                  href="https://discord.gg/g8FnU4vGJv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline ml-1"
                >
                  Discord
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Legal & Ethics */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Legal & Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All challenges on SecureContainProtect CTF are designed for educational purposes. The skills you
                learn here should be used ethically and responsibly. Unauthorized access to computer
                systems is illegal and unethical.
              </p>
              <p className="text-sm text-muted-foreground">
                By using this platform, you agree to use your skills for good and follow all applicable
                laws and regulations.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
