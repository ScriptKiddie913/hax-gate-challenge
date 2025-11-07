import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Flag } from "lucide-react";
import { toast } from "sonner";

interface ScoreEntry {
  user_id: string;
  username: string;
  total_points: number;
  solved_count: number;
  last_submission: string;
}

export default function Scoreboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    loadScoreboard();
    
    // Generate fireflies
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);
    
    // Set up real-time subscription for live scoreboard updates
    const channel = supabase
      .channel('scoreboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'submissions'
        },
        () => {
          loadScoreboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadScoreboard = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_scoreboard');

      if (error) throw error;
      setScores(data || []);
    } catch (error: any) {
      toast.error("Error loading scoreboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-mono">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/s.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blue ambient overlay */}
      <div className="absolute inset-0 bg-[#030b1d]/75 backdrop-blur-[2px]"></div>

      {/* Pulsing gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,150,255,0.15),transparent_70%)] animate-[pulse_8s_infinite_ease-in-out]"></div>

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute bg-[#b8d6ff] rounded-full blur-[3px] opacity-70 animate-[float_10s_infinite_ease-in-out]"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 10px rgba(160,200,255,0.6), 0 0 20px rgba(120,160,255,0.4)",
            animationDelay: f.delay,
          }}
        ></div>
      ))}

      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-4 animate-pulse">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-gradient-cyan">Live Scoreboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">Real-time rankings • Updates automatically</p>
        </div>

        <Card className="border-border bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              Top Performers
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground font-normal">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                Live
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-12">
                <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No submissions yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scores.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 shadow-yellow-500/20'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30 shadow-gray-400/20'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/30 shadow-amber-600/20'
                        : 'bg-secondary/40 border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="flex-1">
                        <p className="font-mono font-bold text-lg">{entry.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Flag className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {entry.solved_count} challenge{entry.solved_count !== 1 ? 's' : ''} solved
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold text-2xl ${
                        index < 3 ? 'text-primary glow-text' : 'text-primary'
                      }`}>
                        {entry.total_points}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        POINTS
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.last_submission 
                          ? new Date(entry.last_submission).toLocaleString()
                          : 'No submissions'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-8px) translateX(-4px) scale(0.95); opacity: 0.4; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
