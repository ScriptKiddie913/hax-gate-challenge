import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Flag, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ScoreEntry {
  user_id: string;
  username: string;
  total_points: number;
  solved_count: number;
  last_submission: string;
}

interface ScoreProgression {
  timestamp: string;
  [key: string]: number | string;
}

export default function Scoreboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressionData, setProgressionData] = useState<ScoreProgression[]>([]);
  const [topUsers, setTopUsers] = useState<string[]>([]);
  const [ctfActive, setCtfActive] = useState(false);
  const [ctfLoading, setCtfLoading] = useState(true);
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  const CHART_COLORS = [
    '#fbbf24', // gold/yellow
    '#a855f7', // purple
    '#3b82f6', // blue
    '#06b6d4', // cyan
    '#f97316', // orange
    '#10b981', // green
    '#ec4899', // pink
    '#ef4444', // red
  ];

  useEffect(() => {
    checkCtfStatus();
    loadScoreboard();
    loadScoreProgression();
    
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
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          loadScoreboard();
          loadScoreProgression();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkCtfStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('ctf_settings')
        .select('start_time, end_time, is_active')
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        const now = new Date();
        const start = new Date(data.start_time);
        const end = new Date(data.end_time);
        setCtfActive(now >= start && now <= end && data.is_active);
      }
    } catch (error: any) {
      console.error('Error checking CTF status:', error);
    } finally {
      setCtfLoading(false);
    }
  };

  const loadScoreProgression = async () => {
    try {
      // Get top 8 users
      const { data: topScores } = await supabase.rpc('get_scoreboard');
      const topUserIds = (topScores || []).slice(0, 8).map((s: ScoreEntry) => s.user_id);
      const topUsernames = (topScores || []).slice(0, 8).map((s: ScoreEntry) => s.username);
      setTopUsers(topUsernames);

      if (topUserIds.length === 0) {
        setProgressionData([]);
        return;
      }

      // Get all correct submissions for top users
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('user_id, created_at, challenge_id, challenges(points)')
        .in('user_id', topUserIds)
        .eq('result', 'CORRECT')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Build progression data
      const userScores: { [key: string]: number } = {};
      const timePoints: { [key: string]: any } = {};

      topUserIds.forEach(uid => {
        userScores[uid] = 0;
      });

      // Add initial point at time 0
      const startTime = submissions && submissions.length > 0 
        ? new Date(submissions[0].created_at).getTime() 
        : Date.now();
      
      const initialPoint: any = { timestamp: new Date(startTime).toLocaleTimeString() };
      topUsernames.forEach(username => {
        initialPoint[username] = 0;
      });
      timePoints[startTime] = initialPoint;

      // Process each submission
      submissions?.forEach((sub: any) => {
        const userId = sub.user_id;
        const userIndex = topUserIds.indexOf(userId);
        if (userIndex === -1) return;

        const username = topUsernames[userIndex];
        const points = sub.challenges?.points || 0;
        userScores[userId] += points;

        const time = new Date(sub.created_at).getTime();
        if (!timePoints[time]) {
          // Copy previous scores
          const prevScores = Object.keys(timePoints).length > 0
            ? timePoints[Math.max(...Object.keys(timePoints).map(Number))]
            : initialPoint;
          timePoints[time] = { 
            timestamp: new Date(time).toLocaleTimeString(),
            ...Object.fromEntries(topUsernames.map(u => [u, prevScores[u] || 0]))
          };
        }
        timePoints[time][username] = userScores[userId];

        // Forward fill scores for all users at this timestamp
        topUsernames.forEach(u => {
          if (timePoints[time][u] === undefined) {
            const prevTime = Math.max(...Object.keys(timePoints).map(Number).filter(t => t < time));
            timePoints[time][u] = prevTime ? timePoints[prevTime][u] : 0;
          }
        });
      });

      const progression = Object.keys(timePoints)
        .sort((a, b) => Number(a) - Number(b))
        .map(time => timePoints[Number(time)]);

      setProgressionData(progression);
    } catch (error: any) {
      console.error('Error loading progression:', error);
    }
  };

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

  if (loading || ctfLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const topThree = scores.slice(0, 3);
  const restOfScores = scores.slice(3);

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

        {!ctfActive ? (
          <Card className="border-border bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardContent className="py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-3xl font-bold mb-2">CTF Not Started</h2>
              <p className="text-muted-foreground text-lg">The competition will begin soon. Stay tuned!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {topThree.map((entry, index) => {
                  const rank = index + 1;
                  const bgGradient = rank === 1 
                    ? 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40'
                    : rank === 2
                    ? 'from-gray-400/20 to-gray-500/20 border-gray-400/40'
                    : 'from-amber-600/20 to-amber-700/20 border-amber-600/40';
                  
                  return (
                    <Card key={entry.user_id} className={`border bg-gradient-to-br ${bgGradient} backdrop-blur-xl shadow-xl`}>
                      <CardContent className="p-6 text-center">
                        <div className="mb-3">
                          {getRankIcon(rank)}
                        </div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                          {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} Place
                        </p>
                        <h3 className="font-mono font-bold text-2xl mb-2">{entry.username}</h3>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                          <Flag className="h-4 w-4" />
                          <span className="text-sm">{entry.solved_count} solved</span>
                        </div>
                        <div className={`text-4xl font-mono font-bold ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : 'text-amber-600'}`}>
                          {entry.total_points}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">POINTS</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Score Progression Chart */}
            {progressionData.length > 0 ? (
              <Card className="border-border bg-[#0f1729]/95 backdrop-blur-xl shadow-2xl mb-6">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                Score Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart 
                  data={progressionData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(100, 116, 139, 0.2)" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(148, 163, 184, 0.6)"
                    tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }}
                    tickLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.6)"
                    tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }}
                    tickLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(100, 116, 139, 0.3)',
                      borderRadius: '8px',
                      color: 'rgba(226, 232, 240, 0.95)',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{
                      color: 'rgba(226, 232, 240, 0.95)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '25px',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}
                    iconType="line"
                  />
                  {topUsers.map((username, index) => (
                    <Line
                      key={username}
                      type="monotone"
                      dataKey={username}
                      stroke={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={3}
                      dot={{ 
                        r: 4, 
                        fill: CHART_COLORS[index % CHART_COLORS.length],
                        strokeWidth: 2,
                        stroke: '#0f1729'
                      }}
                      activeDot={{ 
                        r: 6, 
                        strokeWidth: 2,
                        fill: CHART_COLORS[index % CHART_COLORS.length]
                      }}
                      animationDuration={1000}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
            ) : (
              <Card className="border-border bg-[#0f1729]/95 backdrop-blur-xl shadow-2xl mb-6">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    Score Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-16 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No submissions yet. Be the first to solve a challenge!</p>
                </CardContent>
              </Card>
            )}

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
                {restOfScores.length === 0 && topThree.length === 0 ? (
                  <div className="text-center py-12">
                    <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No submissions yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {restOfScores.map((entry, index) => {
                      const actualRank = index + 4;
                      return (
                        <div
                          key={entry.user_id}
                          className="flex items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-secondary/40 border-border hover:border-primary/30"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 flex items-center justify-center">
                              <span className="text-muted-foreground font-mono">#{actualRank}</span>
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
                            <p className="font-mono font-bold text-2xl text-primary">
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
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
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
