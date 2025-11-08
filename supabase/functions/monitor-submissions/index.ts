import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, challengeId, result } = await req.json();

    // Get recent submissions for this user
    const { data: recentSubmissions } = await supabase
      .from("submissions")
      .select("created_at, result, challenge_id")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (!recentSubmissions || recentSubmissions.length === 0) {
      return new Response(JSON.stringify({ analyzed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Analyze patterns
    const submissionCount = recentSubmissions.length;
    const incorrectCount = recentSubmissions.filter(s => s.result === "INCORRECT").length;
    const sameChallenge = recentSubmissions.filter(s => s.challenge_id === challengeId).length;

    const alerts = [];

    // Detect rapid submissions (more than 10 in 5 minutes)
    if (submissionCount > 10) {
      alerts.push({
        type: "rapid_submission",
        severity: "medium",
        details: {
          submission_count: submissionCount,
          time_window: "5 minutes",
        },
      });
    }

    // Detect brute force (more than 5 incorrect attempts on same challenge)
    if (sameChallenge > 5 && incorrectCount >= 4) {
      alerts.push({
        type: "bruteforce",
        severity: "high",
        details: {
          challenge_attempts: sameChallenge,
          incorrect_count: incorrectCount,
          time_window: "5 minutes",
        },
      });
    }

    // Use AI to analyze patterns
    if (alerts.length > 0) {
      const aiPrompt = `Analyze this CTF submission pattern and determine if it's suspicious:
- User submitted ${submissionCount} times in 5 minutes
- ${incorrectCount} were incorrect
- ${sameChallenge} attempts on the same challenge
- Latest result: ${result}

Respond with ONLY "suspicious" or "normal" and a brief reason.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a security AI analyzing CTF competition behavior for suspicious patterns. Be concise.",
            },
            {
              role: "user",
              content: aiPrompt,
            },
          ],
        }),
      });

      const aiData = await aiResponse.json();
      const aiAnalysis = aiData.choices?.[0]?.message?.content || "";

      if (aiAnalysis.toLowerCase().includes("suspicious")) {
        // Create security alert
        for (const alert of alerts) {
          await supabase.from("security_alerts").insert({
            user_id: userId,
            alert_type: alert.type,
            severity: alert.severity,
            details: {
              ...alert.details,
              ai_analysis: aiAnalysis,
            },
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ analyzed: true, alerts: alerts.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in monitor-submissions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
