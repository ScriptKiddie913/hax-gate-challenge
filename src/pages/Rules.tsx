import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Trophy, Flag, Ban } from "lucide-react";

export default function Rules() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-cyan">Rules & Guidelines</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read and follow these rules to ensure fair play
            </p>
          </div>

          {/* Important notice */}
          <Card className="border-border bg-card/50 backdrop-blur border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <AlertCircle className="h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                All participants must follow these rules. Violation may result in disqualification
                or permanent ban from the platform. Report any suspicious activity immediately.
              </p>
            </CardContent>
          </Card>

          {/* Scoring rules */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Scoring Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Each challenge is worth a specific number of points based on difficulty.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Points are awarded only for the <strong>first correct submission</strong> per user per challenge.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Once you solve a challenge, it becomes <strong>locked</strong> - no further submissions are accepted for that challenge.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Scoreboard ranks are determined by total points, with ties broken by the timestamp of the last
                    successful submission (earlier is better).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Your username (chosen during registration) will be displayed on the public scoreboard.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Submission rules */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                Submission Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Flags must be submitted in the exact format specified in the challenge description (usually{" "}
                    <code className="font-mono bg-secondary px-1 py-0.5 rounded">scpctf{...}</code>).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>You can attempt a challenge <strong>unlimited times</strong> until you find the correct flag.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Rate limiting is in place to prevent brute‑force attacks. Please solve challenges legitimately.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Do not share flags or solutions publicly. Helping others learn is encouraged, but don&apos;t give away answers.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Once a correct flag is submitted, the challenge is immediately locked for that user.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited activities */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-destructive" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No attacks on the platform itself</strong> - Only attack the designated challenge services.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No sharing of flags or writeups</strong> during the active period of challenges.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No automated brute‑forcing</strong> - Excessive failed submission attempts will be flagged.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No DDoS or flooding</strong> - Attacking challenge infrastructure is prohibited.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No multi‑accounting</strong> - One account per person. Creating multiple accounts is cheating.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">✕</span>
                  <span>
                    <strong>No flag format manipulation</strong> - Don&apos;t try to circumvent the submission system.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Account & Access */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Account & Access</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Email verification is <strong>required</strong> before accessing challenges.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Keep your account credentials secure. You are responsible for all activity on your account.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Choose a username that is appropriate and professional (it will be public on the scoreboard).</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Accounts found violating rules may be suspended or permanently banned.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
