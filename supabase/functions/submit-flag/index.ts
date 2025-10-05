import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { challenge_id, submitted_flag } = await req.json();

    if (!challenge_id || !submitted_flag) {
      throw new Error('Missing required fields');
    }

    console.log(`Flag submission attempt for challenge ${challenge_id} by user ${user.id}`);

    // Check if user is banned
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .single();

    if (profile?.is_banned) {
      throw new Error('Your account has been banned');
    }

    // Check if challenge exists and is published
    const { data: challenge, error: challengeError } = await supabaseClient
      .from('challenges')
      .select('id, points, is_published')
      .eq('id', challenge_id)
      .single();

    if (challengeError || !challenge || !challenge.is_published) {
      throw new Error('Challenge not found or not published');
    }

    // Check if user has already solved this challenge
    const { data: existingSolution } = await supabaseClient
      .from('submissions')
      .select('id, result')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge_id)
      .eq('result', 'CORRECT')
      .single();

    if (existingSolution) {
      return new Response(
        JSON.stringify({
          result: 'LOCKED',
          message: 'You have already solved this challenge'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Get the hashed flag from database
    const { data: flagData, error: flagError } = await supabaseClient
      .from('flags')
      .select('hash')
      .eq('challenge_id', challenge_id)
      .single();

    if (flagError || !flagData) {
      console.error('Flag not found for challenge:', challenge_id);
      throw new Error('Flag configuration error');
    }

    // Compare submitted flag with hashed flag
    const isCorrect = await compare(submitted_flag, flagData.hash);

    // Record the submission
    const { error: submissionError } = await supabaseClient
      .from('submissions')
      .insert({
        user_id: user.id,
        challenge_id: challenge_id,
        result: isCorrect ? 'CORRECT' : 'INCORRECT',
        submitted_flag: submitted_flag.substring(0, 50), // Store truncated version for audit
      });

    if (submissionError) {
      console.error('Error recording submission:', submissionError);
      throw new Error('Error recording submission');
    }

    console.log(`Submission recorded: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);

    return new Response(
      JSON.stringify({
        result: isCorrect ? 'CORRECT' : 'INCORRECT',
        points: isCorrect ? challenge.points : 0,
        message: isCorrect 
          ? `Congratulations! You earned ${challenge.points} points!` 
          : 'Incorrect flag. Try again!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in submit-flag function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
