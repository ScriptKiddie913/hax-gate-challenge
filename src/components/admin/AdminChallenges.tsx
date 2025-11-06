import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Flag, Eye, EyeOff, Link as LinkIcon, File } from "lucide-react";
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
  files?: Array<{ name: string; url: string }>;
  links?: Array<{ name: string; url: string }>;
}

export function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("OSINT");
  const [points, setPoints] = useState(100);
  const [description, setDescription] = useState("");
  const [flagValue, setFlagValue] = useState("");
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [links, setLinks] = useState<Array<{ name: string; url: string }>>([]);
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChallenges((data || []).map(d => ({
        ...d,
        files: Array.isArray(d.files) ? d.files as Array<{ name: string; url: string }> : [],
        links: Array.isArray(d.links) ? d.links as Array<{ name: string; url: string }> : []
      })));
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
      setFlagValue("");
      setFiles(Array.isArray(challenge.files) ? challenge.files : []);
      setLinks(Array.isArray(challenge.links) ? challenge.links : []);
    } else {
      setEditingChallenge(null);
      setTitle("");
      setCategory("OSINT");
      setPoints(100);
      setDescription("");
      setFlagValue("");
      setFiles([]);
      setLinks([]);
    }
    setNewFileName("");
    setNewFileUrl("");
    setNewLinkName("");
    setNewLinkUrl("");
    setDialogOpen(true);
  };

  const handleSaveChallenge = async () => {
    if (!title || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");

      if (editingChallenge) {
        // Update existing challenge
        const { error } = await supabase
          .from("challenges")
          .update({
            title,
            category,
            points,
            description_md: description,
            files: files,
            links: links,
          })
          .eq("id", editingChallenge.id);

        if (error) throw error;

        // Update flag directly if provided
        if (flagValue) {
          const { error: flagUpdateError } = await supabase
            .from("challenges")
            .update({ flag: flagValue } as any)
            .eq("id", editingChallenge.id);
          if (flagUpdateError) throw flagUpdateError;
        }

        toast.success("Challenge updated successfully");
      } else {
        // Create new challenge
        const { data: newChallenge, error: challengeError } = await supabase
          .from("challenges")
          .insert({
            title,
            category,
            points,
            description_md: description,
            created_by: user.id,
            is_published: false,
            flag: flagValue || null,
            files: files,
            links: links,
          })
          .select()
          .single();

        if (challengeError) throw challengeError;

        toast.success(flagValue ? "Challenge created with flag" : "Challenge created");
      }

      setDialogOpen(false);
      loadChallenges();
    } catch (error: any) {
      console.error("Save challenge error:", error);
      toast.error(error.message || "Error saving challenge");
    }
  };

  const togglePublish = async (challengeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("challenges")
        .update({ is_published: !currentStatus })
        .eq("id", challengeId);

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
        .from("challenges")
        .delete()
        .eq("id", challengeId);

      if (error) throw error;

      toast.success("Challenge deleted");
      loadChallenges();
    } catch (error: any) {
      toast.error("Error deleting challenge");
    }
  };

  const addFile = () => {
    if (newFileName && newFileUrl) {
      setFiles([...files, { name: newFileName, url: newFileUrl }]);
      setNewFileName("");
      setNewFileUrl("");
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLinkName && newLinkUrl) {
      setLinks([...links, { name: newLinkName, url: newLinkUrl }]);
      setNewLinkName("");
      setNewLinkUrl("");
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
                        <SelectItem value="OSINT">🔍 OSINT</SelectItem>
                        <SelectItem value="Web">🌐 Web</SelectItem>
                        <SelectItem value="Forensics">🔬 Forensics</SelectItem>
                        <SelectItem value="Misc">🎯 Misc</SelectItem>
                        <SelectItem value="Crypto">🔐 Crypto</SelectItem>
                        <SelectItem value="Malware">☠️ Malware</SelectItem>
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
                      ? "Leave empty to keep existing flag, or enter a new one to overwrite it."
                      : "Flag will be stored in the challenge record."}
                  </p>
                </div>

                {/* Files Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Challenge Files
                  </Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded bg-secondary/30">
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="File name"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                      />
                      <Input
                        placeholder="File URL"
                        value={newFileUrl}
                        onChange={(e) => setNewFileUrl(e.target.value)}
                      />
                      <Button size="sm" onClick={addFile}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Links Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Challenge Links
                  </Label>
                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded bg-secondary/30">
                        <span className="flex-1 text-sm truncate">{link.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLink(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Link name"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                      />
                      <Input
                        placeholder="Link URL"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                      />
                      <Button size="sm" onClick={addLink}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChallenge}>
                  {editingChallenge ? "Update" : "Create"}
                </Button>
              </DialogFooter>
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