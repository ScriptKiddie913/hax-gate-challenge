import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      throw new Error('Admin access required');
    }

    const { challenge_id, flag } = await req.json();

    if (!challenge_id || !flag) {
      throw new Error('Missing required fields');
    }

    console.log(`Admin ${user.email} setting flag for challenge ${challenge_id}`);

    // Hash the flag using bcrypt with auto salt generation
    const flagHash = await hash(flag);

    // Check if flag already exists for this challenge
    const { data: existingFlag } = await supabaseClient
      .from('flags')
      .select('id')
      .eq('challenge_id', challenge_id)
      .single();

    if (existingFlag) {
      // Update existing flag
      const { error: updateError } = await supabaseClient
        .from('flags')
        .update({ hash: flagHash })
        .eq('challenge_id', challenge_id);

      if (updateError) throw updateError;
    } else {
      // Insert new flag
      const { error: insertError } = await supabaseClient
        .from('flags')
        .insert({ challenge_id, hash: flagHash });

      if (insertError) throw insertError;
    }

    // Log admin action
    await supabaseClient
      .from('audit_logs')
      .insert({
        actor_id: user.id,
        action: 'SET_FLAG',
        meta: { challenge_id }
      });

    console.log('Flag set successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Flag set successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in admin-set-flag function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
