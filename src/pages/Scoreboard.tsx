import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Flag, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ScoreEntry {
  user_id: string;
  username: string;
  total_points: number;
  solved_count: number;
  last_submission: string;
}

interface RegisteredUser {
  user_id: string;
  username: string;
  created_at: string;
}

interface ScoreProgression {
  timestamp: string;
  [key: string]: number | string;
}

export default function Scoreboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressionData, setProgressionData] = useState<ScoreProgression[]>([]);
  const [topUsers, setTopUsers] = useState<string[]>([]);
  const [ctfActive, setCtfActive] = useState(false);
  const [ctfLoading, setCtfLoading] = useState(true);
  const [fireflies, setFireflies] = useState<
    { id: number; top: string; left: string; delay: string; size: string }[]
  >([]);

  const [sleighDuration, setSleighDuration] = useState<number>(() => {
    return Math.floor(Math.random() * (46 - 18 + 1)) + 18;
  });
  const [sleighDelay, setSleighDelay] = useState<number>(() => {
    return Math.floor(Math.random() * 10);
  });
  const [sleighTopOffset, setSleighTopOffset] = useState<number>(() => {
    return Math.floor(Math. random() * (28 - 6 + 1)) + 6;
  });
  const [sleighDirection, setSleighDirection] = useState<"ltr" | "rtl">(() => {
    return Math. random() > 0.5 ? "ltr" : "rtl";
  });

  const CHART_COLORS = [
    '#fbbf24',
    '#a855f7',
    '#3b82f6',
    '#06b6d4',
    '#f97316',
    '#10b981',
    '#ec4899',
    '#ef4444',
  ];

  useEffect(() => {
    checkCtfStatus();
    loadScoreboard();
    loadScoreProgression();
    loadAllUsers();

    const generated = Array.from({ length: 30 }). map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }));
    setFireflies(generated);

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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          loadAllUsers();
        }
      )
      . subscribe();

    let sleighTimeout: NodeJS.Timeout;
    const scheduleNextSleigh = () => {
      const nextDuration = Math.floor(Math. random() * (46 - 18 + 1)) + 18;
      const nextDelay = Math.floor(Math.random() * 10);
      const nextTop = Math.floor(Math.random() * (28 - 6 + 1)) + 6;
      const nextDir = Math.random() > 0.5 ? "ltr" : "rtl";
      sleighTimeout = setTimeout(() => {
        setSleighDuration(nextDuration);
        setSleighDelay(nextDelay);
        setSleighTopOffset(nextTop);
        setSleighDirection(nextDir as "ltr" | "rtl");
        scheduleNextSleigh();
      }, (sleighDuration + Math.floor(Math.random() * 8)) * 1000);
    };
    scheduleNextSleigh();

    return () => {
      supabase.removeChannel(channel);
      if (sleighTimeout) clearTimeout(sleighTimeout);
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
      const { data: topScores } = await supabase. rpc('get_scoreboard');
      const topUserIds = (topScores || []).slice(0, 8).map((s: ScoreEntry) => s.user_id);
      const topUsernames = (topScores || []).slice(0, 8). map((s: ScoreEntry) => s.username);
      setTopUsers(topUsernames);

      if (topUserIds.length === 0) {
        setProgressionData([]);
        return;
      }

      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('user_id, created_at, challenge_id, challenges(points)')
        .in('user_id', topUserIds)
        .eq('result', 'CORRECT')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const userScores: { [key: string]: number } = {};
      const timePoints: { [key: string]: any } = {};

      topUserIds.forEach(uid => {
        userScores[uid] = 0;
      });

      const startTime = submissions && submissions.length > 0 
        ? new Date(submissions[0].created_at).getTime() 
        : Date.now();
      
      const initialPoint: any = { timestamp: new Date(startTime).toLocaleTimeString() };
      topUsernames.forEach(username => {
        initialPoint[username] = 0;
      });
      timePoints[startTime] = initialPoint;

      submissions?.forEach((sub: any) => {
        const userId = sub.user_id;
        const userIndex = topUserIds.indexOf(userId);
        if (userIndex === -1) return;

        const username = topUsernames[userIndex];
        const points = sub.challenges?. points || 0;
        userScores[userId] += points;

        const time = new Date(sub.created_at).getTime();
        if (!timePoints[time]) {
          const prevScores = Object.keys(timePoints).length > 0
            ? timePoints[Math.max(...Object.keys(timePoints).map(Number))]
            : initialPoint;
          timePoints[time] = { 
            timestamp: new Date(time).toLocaleTimeString(),
            ...Object.fromEntries(topUsernames.map(u => [u, prevScores[u] || 0]))
          };
        }
        timePoints[time][username] = userScores[userId];

        topUsernames.forEach(u => {
          if (timePoints[time][u] === undefined) {
            const prevTime = Math.max(...Object.keys(timePoints). map(Number). filter(t => t < time));
            timePoints[time][u] = prevTime ?  timePoints[prevTime][u] : 0;
          }
        });
      });

      const progression = Object.keys(timePoints)
        .sort((a, b) => Number(a) - Number(b))
        .map(time => timePoints[Number(time)]);

      setProgressionData(progression);
    } catch (error: any) {
      console. error('Error loading progression:', error);
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
      console. error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase. rpc('get_all_participants');

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error: any) {
      console.error('Error loading all users:', error);
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
        backgroundImage: "url('/images/s. png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#030b1d]/75 backdrop-blur-[2px]"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,150,255,0.15),transparent_70%)] animate-[pulse_8s_infinite_ease-in-out]"></div>

      <div aria-hidden className="absolute inset-0 pointer-events-none z-40">
        <div className="crystal-layer large"></div>
        <div className="crystal-layer medium"></div>
        <div className="crystal-layer small"></div>
        <div className="crystal-layer sparkle"></div>
      </div>

      <div
        aria-hidden
        className={`santa-container ${sleighDirection === "rtl" ? "rtl" : "ltr"}`}
        style={{
          top: `${sleighTopOffset}vh`,
          animationDuration: `${sleighDuration}s`,
          animationDelay: `${sleighDelay}s`,
        }}
      >
        <div className="santa-sleigh" style={{ width: 180 }}>
          <div className="sleigh-trail" />
          <svg
            viewBox="0 0 640 256"
            xmlns="http://www.w3. org/2000/svg"
            className="santa-svg"
            aria-hidden
            width="180"
            height="72"
          >
            <g fill="none" stroke="none">
              <g transform="translate(0,0)" fill="#f8f2e8" opacity="0.95">
                <path d="M72 28c-2 0-4 3-4 6 0 4 2 7 4 7 3 0 5-3 5-7 0-3-2-6-5-6z" />
                <path d="M90 20c-6 0-12 6-12 12v8c0 8 8 14 16 14 9 0 16-6 16-14v-8c0-6-6-12-12-12h-8z" />
                <path d="M96 18c4-2 10-6 14-6 2 0 4 2 4 4 0 4-6 8-10 10-6 2-20 6-20 6" opacity="0.9" />
              </g>
              <g transform="translate(180,36) scale(0.9)" fill="#ff6b6b">
                <rect x="0" y="0" rx="10" ry="10" width="120" height="28" />
                <path d="M0 24 q18 12 40 12 h32 q20 0 40 -12 v-4 h-112 z" fill="#9f2b2b" opacity="0.9"/>
              </g>
              <g transform="translate(150,10) scale(0.45)" fill="#fff">
                <circle cx="36" cy="36" r="20" fill="#fff" />
                <path d="M12 12 q36 -18 60 0 q-8 2 -24 2 q-24 0 -36 -2 z" fill="#e53e3e" />
              </g>
              <g transform="translate(0,0)" opacity="0.35" fill="#ffffff">
                <ellipse cx="320" cy="40" rx="150" ry="12" />
              </g>
            </g>
          </svg>
        </div>
      </div>

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

        {! ctfActive ?  (
          <Card className="border-border bg-card/80 backdrop-blur-xl shadow-2xl mb-8">
            <CardContent className="py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-3xl font-bold mb-2">CTF Not Started</h2>
              <p className="text-muted-foreground text-lg">The scoreboard and progression graph will appear when the competition begins! </p>
            </CardContent>
          </Card>
        ) : (
          <>
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

            {progressionData.length > 0 ?  (
              <Card className="border-border bg-[#0f1729]/95 backdrop-blur-xl shadow-2xl mb-8">
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
              <Card className="border-border bg-[#0f1729]/95 backdrop-blur-xl shadow-2xl mb-8">
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
          </>
        )}

        {/* All Registered Participants - Now positioned below the scoreboard */}
        <Card className="border-border bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              All Registered Participants
              <span className="ml-auto text-sm text-muted-foreground font-normal">
                {allUsers.length} total
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {allUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No participants registered yet. </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {allUsers.map((user) => {
                  const scoreEntry = scores.find(s => s.user_id === user.user_id);
                  const points = scoreEntry?.total_points || 0;
                  const solves = scoreEntry?.solved_count || 0;
                  const rank = scores.findIndex(s => s. user_id === user.user_id) + 1;
                  
                  return (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-secondary/30 border-border hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          {rank > 0 ?  (
                            <span className="text-xs font-mono font-bold text-primary">#{rank}</span>
                          ) : (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-sm">{user.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-primary">{points}</p>
                        <p className="text-xs text-muted-foreground">{solves} solves</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) translateX(6px) scale(1.1); opacity: 0.9; }
          50% { transform: translateY(-8px) translateX(-4px) scale(0.95); opacity: 0.4; }
          75% { transform: translateY(8px) translateX(5px) scale(1.05); opacity: 0. 8; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
        }

        .crystal-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .crystal-layer. large {
          background-image: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.96) 1. 6px, rgba(255,255,255,0) 1.6px);
          background-size: 22px 22px;
          opacity: 0.14;
          filter: blur(0.5px) saturate(1.15);
          animation: crystal-large 36s linear infinite;
          mix-blend-mode: screen;
        }

        .crystal-layer.medium {
          background-image: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.92) 1.2px, rgba(255,255,255,0) 1.2px);
          background-size: 14px 14px;
          opacity: 0.10;
          animation: crystal-medium 46s linear infinite;
          filter: blur(0.35px) saturate(1.05);
          mix-blend-mode: screen;
        }

        .crystal-layer.small {
          background-image: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.86) 0.9px, rgba(255,255,255,0) 0.9px);
          background-size: 8px 8px;
          opacity: 0.06;
          animation: crystal-small 28s linear infinite;
          filter: blur(0.15px);
          mix-blend-mode: screen;
        }

        . crystal-layer.sparkle {
          background-image: radial-gradient(circle at 30% 20%, rgba(255,255,255,1) 0.6px, rgba(255,255,255,0) 0.6px);
          background-size: 4px 4px;
          opacity: 0.045;
          animation: crystal-sparkle 12s linear infinite;
          filter: drop-shadow(0 0 6px rgba(180,220,255,0.12));
          mix-blend-mode: screen;
        }

        @keyframes crystal-large {
          0% { background-position: 0 -10vh; transform: translateY(-5%) translateX(0); }
          25% { transform: translateY(20%) translateX(28px); }
          50% { background-position: 400px 50vh; transform: translateY(55%) translateX(-38px); }
          75% { transform: translateY(80%) translateX(22px); }
          100% { background-position: 800px 140vh; transform: translateY(140%) translateX(0); }
        }
        @keyframes crystal-medium {
          0% { background-position: 0 -8vh; transform: translateY(-3%) translateX(0); }
          50% { transform: translateY(70%) translateX(50px); }
          100% { background-position: 900px 120vh; transform: translateY(140%) translateX(-20px); }
        }
        @keyframes crystal-small {
          0% { background-position: 0 0; transform: translateY(-2%) translateX(0); }
          100% { background-position: 1200px 160vh; transform: translateY(160%) translateX(-40px); }
        }
        @keyframes crystal-sparkle {
          0% { opacity: 0.02; transform: translateY(0) scale(0.9) }
          20% { opacity: 0.16; transform: translateY(20%) scale(1.05) }
          40% { opacity: 0.04; transform: translateY(40%) scale(0.95) }
          60% { opacity: 0.18; transform: translateY(60%) scale(1.1) }
          80% { opacity: 0.03; transform: translateY(80%) scale(0.9) }
          100% { opacity: 0.06; transform: translateY(120%) scale(1) }
        }

        .santa-container {
          position: absolute;
          left: -220px;
          z-index: 48;
          pointer-events: none;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        . santa-container.rtl {
          left: auto;
          right: -220px;
        }

        .santa-container.ltr {
          animation-name: sleigh-fly-ltr;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }

        .santa-container.rtl {
          animation-name: sleigh-fly-rtl;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }

        .santa-container.ltr,
        .santa-container.rtl {
          animation-duration: var(--dummy, 30s);
          animation-delay: var(--dummy-delay, 0s);
        }

        @keyframes sleigh-fly-ltr {
          0% { transform: translateX(-8vw) translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 1; }
          50% { transform: translateX(110vw) translateY(6vh) rotate(0. 5deg); opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(125vw) translateY(12vh) rotate(1deg); opacity: 0; }
        }
        @keyframes sleigh-fly-rtl {
          0% { transform: translateX(8vw) translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 1; }
          50% { transform: translateX(-110vw) translateY(6vh) rotate(-0.5deg); opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(-125vw) translateY(12vh) rotate(-1deg); opacity: 0; }
        }

        .santa-sleigh {
          position: relative;
          display: inline-block;
          transform-origin: center center;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.45));
        }
        .santa-svg {
          display: block;
          transform-origin: center center;
        }

        .sleigh-trail {
          position: absolute;
          left: -40px;
          top: 18px;
          width: 260px;
          height: 24px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.12), rgba(160,220,255,0.06), rgba(255,255,255,0.08));
          filter: blur(6px) saturate(1.2);
          opacity: 0.85;
          transform-origin: left center;
          pointer-events: none;
          mix-blend-mode: screen;
          background-size: 200% 100%;
          animation: trail-shimmer 3. 6s linear infinite;
        }
        @keyframes trail-shimmer {
          0% { background-position: 0% 50%; opacity: 0.9; transform: scaleX(0.95) translateY(0px) }
          50% { background-position: 100% 50%; opacity: 1; transform: scaleX(1.05) translateY(-3px) }
          100% { background-position: 0% 50%; opacity: 0.9; transform: scaleX(0.95) translateY(0px) }
        }

        . sleigh-trail::before,
        .sleigh-trail::after {
          content: '';
          position: absolute;
          right: 8px;
          top: -6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0.1));
          filter: blur(2px);
          opacity: 0.9;
          transform: translateX(0) translateY(0);
        }
        .sleigh-trail::after {
          right: 60px;
          top: 2px;
          width: 10px;
          height: 10px;
          opacity: 0.7;
        }

        @media (max-width: 640px) {
          .santa-sleigh { width: 120px ! important; }
          .sleigh-trail { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .crystal-layer, .santa-container, .sleigh-trail, .santa-sleigh, .crystal-layer.large, .crystal-layer.medium, .crystal-layer.small, . crystal-layer.sparkle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
