import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Save, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface CTFSettings {
  id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export function CTFTimer() {
  const [settings, setSettings] = useState<CTFSettings | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ctf_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setStartTime(formatDateTimeLocal(data.start_time));
        setEndTime(formatDateTimeLocal(data.end_time));
      }
    } catch (error: any) {
      toast.error("Error loading CTF settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (isoString: string): string => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const handleSave = async () => {
    if (!startTime || !endTime) {
      toast.error("Please set both start and end times");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    setSaving(true);
    try {
      if (settings) {
        // Update existing settings
        const { error } = await supabase
          .from('ctf_settings')
          .update({
            start_time: start.toISOString(),
            end_time: end.toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('ctf_settings')
          .insert({
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            is_active: true
          });

        if (error) throw error;
      }

      toast.success("CTF timer updated successfully");
      await loadSettings();
    } catch (error: any) {
      toast.error("Error saving CTF settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('ctf_settings')
        .update({ is_active: !settings.is_active })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success(settings.is_active ? "CTF deactivated" : "CTF activated");
      await loadSettings();
    } catch (error: any) {
      toast.error("Error toggling CTF status");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const isCurrentlyActive = (): boolean => {
    if (!settings || !settings.is_active) return false;
    const now = new Date();
    const start = new Date(settings.start_time);
    const end = new Date(settings.end_time);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          CTF Timer Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        {settings && (
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTF Status</p>
                <p className="font-semibold">
                  {isCurrentlyActive() ? (
                    <span className="text-green-500">● Live</span>
                  ) : settings.is_active ? (
                    <span className="text-yellow-500">● Scheduled</span>
                  ) : (
                    <span className="text-red-500">● Inactive</span>
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleToggleActive}
                disabled={saving}
              >
                {settings.is_active ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Timer"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">ℹ️ Important:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Challenges are only visible to users during the active CTF window</li>
            <li>Admins can always see challenges regardless of timer</li>
            <li>Deactivating the timer will hide all challenges from users</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
