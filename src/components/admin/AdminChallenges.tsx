import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Flag, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  description_md: string;
  is_published: boolean;
  created_at: string;
}

export function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("web");
  const [points, setPoints] = useState(100);
  const [description, setDescription] = useState("");
  const [flagValue, setFlagValue] = useState("");

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error: any) {
      toast.error("Error loading challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (challenge?: Challenge) => {
    if (challenge) {
      setEditingChallenge(challenge);
      setTitle(challenge.title);
      setCategory(challenge.category);
      setPoints(challenge.points);
      setDescription(challenge.description_md);
      setFlagValue(""); // Don't show existing flag
    } else {
      setEditingChallenge(null);
      setTitle("");
      setCategory("web");
      setPoints(100);
      setDescription("");
      setFlagValue("");
    }
    setDialogOpen(true);
  };

  const handleSaveChallenge = async () => {
    if (!title || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingChallenge) {
        // Update existing challenge
        const { error } = await supabase
          .from('challenges')
          .update({
            title,
            category,
            points,
            description_md: description,
          })
          .eq('id', editingChallenge.id);

        if (error) throw error;

        // Update flag if provided
        if (flagValue) {
          await supabase.functions.invoke('admin-set-flag', {
            body: { challenge_id: editingChallenge.id, flag: flagValue }
          });
        }

        toast.success("Challenge updated");
      } else {
        // Create new challenge
        const { data: newChallenge, error: challengeError } = await supabase
          .from('challenges')
          .insert({
            title,
            category,
            points,
            description_md: description,
            created_by: user.id,
            is_published: false,
          })
          .select()
          .single();

        if (challengeError) throw challengeError;

        // Set flag
        if (flagValue) {
          await supabase.functions.invoke('admin-set-flag', {
            body: { challenge_id: newChallenge.id, flag: flagValue }
          });
        }

        toast.success("Challenge created");
      }

      setDialogOpen(false);
      loadChallenges();
    } catch (error: any) {
      toast.error(error.message || "Error saving challenge");
    }
  };

  const togglePublish = async (challengeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ is_published: !currentStatus })
        .eq('id', challengeId);

      if (error) throw error;

      toast.success(currentStatus ? "Challenge unpublished" : "Challenge published");
      loadChallenges();
    } catch (error: any) {
      toast.error("Error updating challenge");
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;

      toast.success("Challenge deleted");
      loadChallenges();
    } catch (error: any) {
      toast.error("Error deleting challenge");
    }
  };

  if (loading) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardContent className="pt-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Challenge Management
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the challenge details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Challenge title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="pwn">Pwn</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="rev">Reverse Engineering</SelectItem>
                        <SelectItem value="forensics">Forensics</SelectItem>
                        <SelectItem value="misc">Misc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Markdown)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Challenge description in markdown..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag">Flag</Label>
                  <Input
                    id="flag"
                    value={flagValue}
                    onChange={(e) => setFlagValue(e.target.value)}
                    placeholder="flag{example_flag_here}"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    {editingChallenge 
                      ? "Leave empty to keep existing flag, or enter new flag to update"
                      : "The flag will be securely hashed before storage"
                    }
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChallenge}>
                  {editingChallenge ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold">{challenge.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {challenge.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {challenge.points} pts
                  </Badge>
                  {challenge.is_published ? (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Draft
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {challenge.description_md}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublish(challenge.id, challenge.is_published)}
                  className="gap-2"
                >
                  {challenge.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(challenge)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteChallenge(challenge.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {challenges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No challenges found. Create your first challenge!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
