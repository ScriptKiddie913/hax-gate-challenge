import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SCPHeader } from "@/components/SCPHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------
// Countdown Component (Fixed)
// ---------------------------

interface CountdownProps {
  startTime: string | null;
}

const CTFCountdown = ({ startTime }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    if (!startTime) {
      setTimeLeft("NO START TIME");
      return;
    }

    const calculateTimeLeft = () => {
      try {
        console.log("CTF Countdown - Raw startTime from Supabase:", startTime);

        // Ensure the timestamp is UTC-safe
        const safeTime = startTime.endsWith("Z") ? startTime : startTime + "Z";
        const startTimestamp = Date.parse(safeTime);

        console.log("Parsed start time (UTC-safe):", new Date(startTimestamp).toISOString());

        if (isNaN(startTimestamp)) {
          console.error("Invalid startTime detected:", startTime);
          setTimeLeft("INVALID TIME FORMAT");
          return;
        }

        const now = Date.now();
        const difference = startTimestamp - now;

        if (difference <= 0) {
          setTimeLeft("BREACH IMMINENT");
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const formatted = `${days}D : ${hours}H : ${minutes}M : ${seconds}S`;
        setTimeLeft(formatted);
      } catch (error) {
        console.error("Error calculating time left:", error);
        setTimeLeft("ERROR");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-2 text-red-600">CTF Countdown</h2>
      <p className="text-xl font-mono bg-black text-green-400 p-3 rounded-lg shadow-lg border border-green-500">
        {timeLeft}
      </p>
    </div>
  );
};

// ---------------------------
// Challenge Page
// ---------------------------

export default function ChallengePage() {
  const [ctfSettings, setCtfSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCTFSettings = async () => {
      console.log("Fetching CTF settings from Supabase...");
      const { data, error } = await supabase.from("ctf_settings").select("*").single();

      if (error) {
        console.error("Error fetching CTF settings:", error);
      } else {
        console.log("CTF settings fetched successfully:", data);
        setCtfSettings(data);
      }
    };

    const fetchChallenges = async () => {
      console.log("Fetching challenges from Supabase...");
      const { data, error } = await supabase.from("challenges").select("*");

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        console.log("Challenges fetched successfully:", data);
        setChallenges(data);
      }
    };

    Promise.all([fetchCTFSettings(), fetchChallenges()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono">
        <p>Loading Challenge Data...</p>
      </div>
    );
  }

  if (!ctfSettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-400 font-mono">
        <p>Failed to load CTF configuration. Please check Supabase connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <SCPHeader title="SCP CTF Breach Simulation" />
      <main className="container mx-auto py-10 px-4">
        <Card className="bg-gray-900 border border-red-600 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500 font-bold">
              {ctfSettings.title || "Unnamed CTF Event"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {ctfSettings.description || "No description provided for this event."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CTFCountdown startTime={ctfSettings.start_time} />
            <div className="mt-6 text-sm text-gray-400">
              <p>
                <strong>Event Start Time (raw):</strong> {ctfSettings.start_time || "N/A"}
              </p>
              <p>
                <strong>Event Status:</strong>{" "}
                {ctfSettings.active ? (
                  <Badge variant="destructive" className="bg-green-600">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    Inactive
                  </Badge>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="bg-gray-900 border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
              onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-red-400">
                  {challenge.title || "Untitled Challenge"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {challenge.category || "Uncategorized"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">
                  {challenge.description || "No description available."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {challenge.tags?.split(",").map((tag: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs text-gray-400 border-gray-600"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
