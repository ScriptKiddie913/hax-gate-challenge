import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Edit, Trash2, Flag, Eye, EyeOff, Link as LinkIcon, File, Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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
      setChallenges(
        (data || []).map((d) => ({
          ...d,
          files: Array.isArray(d.files)
            ? (d.files as Array<{ name: string; url: string }>)
            : [],
          links: Array.isArray(d.links)
            ? (d.links as Array<{ name: string; url: string }>)
            : [],
        }))
      );
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
    setNewLinkName("");
    setNewLinkUrl("");
    setDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info("Uploading file...");

      // Upload file to Supabase Storage
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("challenge_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("challenge_files")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) throw new Error("Failed to get public URL");

      const newFile = { name: file.name, url: urlData.publicUrl };
      setFiles([...files, newFile]);
      toast.success("File uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading file");
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

  const handleSaveChallenge = async () => {
    if (!title || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");

      if (editingChallenge) {
        const { error } = await supabase
          .from("challenges")
          .update({
            title,
            category,
            points,
            description_md: description,
            files,
            links,
          })
          .eq("id", editingChallenge.id);

        if (error) throw error;

        // Set flag using secure RPC function if provided
        if (flagValue && flagValue.trim()) {
          const { error: flagError } = await supabase.rpc('admin_set_flag', {
            p_challenge_id: editingChallenge.id,
            p_flag: flagValue.trim()
          });
          if (flagError) throw flagError;
        }


        toast.success("Challenge updated successfully");
      } else {
        const { error: challengeError } = await supabase
          .from("challenges")
          .insert({
            title,
            category,
            points,
            description_md: description,
            created_by: user.id,
            is_published: false,
            flag: flagValue || null,
            files,
            links,
          });

        if (challengeError) throw challengeError;

        toast.success("Challenge created successfully!");
      }

      setDialogOpen(false);
      loadChallenges();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error saving challenge");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      // Prevent publishing without a configured flag
      if (!currentStatus) {
        // Check if flag exists using secure RPC function
        const { data: hasFlag, error: flagError } = await supabase
          .rpc('admin_has_flag', { p_challenge_id: id });
        
        if (flagError || !hasFlag) {
          toast.error("Please set a flag before publishing this challenge.");
          return;
        }
      }

      const { error } = await supabase
        .from("challenges")
        .update({ is_published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(currentStatus ? "Challenge unpublished" : "Challenge published");
      loadChallenges();
    } catch (error: any) {
      toast.error("Error updating challenge");
    }
  };

  const deleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
      const { error } = await supabase.from("challenges").delete().eq("id", id);
      if (error) throw error;

      toast.success("Challenge deleted");
      loadChallenges();
    } catch {
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
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl text-[#eaf0ff]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#a8c8ff]">
            <Flag className="h-5 w-5 text-[#8abaff]" />
            Challenge Management
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2 bg-[#2a62cc]/70 hover:bg-[#3c74dd]/80">
                <Plus className="h-4 w-4" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-2xl border border-white/20">
              <DialogHeader>
                <DialogTitle className="text-[#bcd0ff]">
                  {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
                </DialogTitle>
                <DialogDescription className="text-[#d4e0ff]/80">
                  Fill in the challenge details below
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OSINT">OSINT</SelectItem>
                        <SelectItem value="Web">Web</SelectItem>
                        <SelectItem value="Forensics">Forensics</SelectItem>
                        <SelectItem value="Misc">Misc</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                        <SelectItem value="Malware">Malware</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={1} />
                  </div>
                </div>

                <div>
                  <Label>Description (Markdown)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>Flag</Label>
                  <Input
                    value={flagValue}
                    onChange={(e) => setFlagValue(e.target.value)}
                    placeholder="flag{example_flag_here}"
                    className="font-mono"
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <Label className="flex items-center gap-2">
                    <File className="h-4 w-4" /> Challenge Files
                  </Label>
                  <div className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border border-white/10 rounded bg-white/5">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm truncate">
                          {file.name}
                        </a>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input type="file" accept="*" onChange={handleFileUpload} className="cursor-pointer text-sm" />
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Challenge Links
                  </Label>
                  <div className="mt-2 space-y-2">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border border-white/10 rounded bg-white/5">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm truncate">
                          {link.name}
                        </a>
                        <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>
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
        {challenges.length === 0 ? (
          <div className="text-center py-8 text-[#cbd8ff]/70">No challenges yet.</div>
        ) : (
          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-[#eaf0ff]">{c.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {c.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {c.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-[#cbd8ff]/70 line-clamp-1">{c.description_md}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(c.id, c.is_published)}
                    className="gap-2"
                  >
                    {c.is_published ? <><EyeOff className="h-4 w-4" /> Unpublish</> : <><Eye className="h-4 w-4" /> Publish</>}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(c)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteChallenge(c.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
