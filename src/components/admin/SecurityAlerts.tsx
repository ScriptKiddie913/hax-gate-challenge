import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Check, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: string;
  details: any;
  created_at: string;
  acknowledged: boolean;
  profile?: { username: string };
}

export function SecurityAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();

    // Subscribe to new alerts
    const channel = supabase
      .channel("security_alerts_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "security_alerts",
        },
        () => {
          loadAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("security_alerts")
        .select(`
          *,
          profile:profiles!security_alerts_user_id_fkey(username)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const enrichedAlerts = (data || []).map((alert: any) => ({
        ...alert,
        profile: alert.profile || { username: 'Unknown' }
      }));
      
      setAlerts(enrichedAlerts);
    } catch (error: any) {
      toast.error("Error loading security alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("security_alerts")
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", alertId);

      if (error) throw error;
      toast.success("Alert acknowledged");
      loadAlerts();
    } catch (error: any) {
      toast.error("Error acknowledging alert");
      console.error(error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive";
      case "medium":
        return "bg-amber-500/20 text-amber-500 border-amber-500";
      case "low":
        return "bg-blue-500/20 text-blue-500 border-blue-500";
      default:
        return "bg-muted/20 text-muted-foreground border-muted";
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "bruteforce":
        return "Brute Force Attack";
      case "rapid_submission":
        return "Rapid Submissions";
      case "suspicious_pattern":
        return "Suspicious Pattern";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card className="scp-paper border-2 border-border">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="font-mono text-muted-foreground">LOADING ALERTS...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="scp-paper border-2 border-border">
      <CardHeader>
        <div className="classification-bar mb-3" />
        <CardTitle className="flex items-center gap-2 font-mono">
          <Shield className="h-5 w-5 text-primary" />
          AI SECURITY MONITORING
        </CardTitle>
        <div className="classification-bar mt-3" />
        <p className="text-sm text-muted-foreground font-mono">
          Automated threat detection and suspicious activity monitoring
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-success mx-auto mb-4 opacity-50" />
              <p className="font-mono text-muted-foreground">
                No security alerts detected
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                AI monitoring is active and running
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-2 rounded-lg ${
                    alert.acknowledged
                      ? "bg-background/30 border-border/50 opacity-60"
                      : "bg-background/70 border-primary glow-blue-box"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          alert.severity === "high"
                            ? "text-destructive"
                            : alert.severity === "medium"
                            ? "text-amber-500"
                            : "text-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-mono font-bold text-sm mb-1">
                          {getAlertTypeLabel(alert.alert_type)}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          User:{" "}
                          <span className="text-primary">
                            {alert.profile?.username || "Unknown"}
                          </span>
                        </p>
                        <div className="text-xs space-y-1">
                          {Object.entries(alert.details).map(([key, value]) => (
                            <p key={key} className="text-muted-foreground">
                              <span className="font-semibold">{key}:</span>{" "}
                              {String(value)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={`${getSeverityColor(alert.severity)} font-mono text-xs`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.acknowledged && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="font-mono text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
