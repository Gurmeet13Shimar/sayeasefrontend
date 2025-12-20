import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Sparkles, FileText, Trash2, Loader2 } from "lucide-react";

export default function SmartNotes({ user }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { data: notes, isLoading } = useQuery({ 
    queryKey: ["/api/notes"],
  });

  const createNote = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/notes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  const deleteNote = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setSelectedNote(null);
    },
  });

  const summarizeNote = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/notes/summarize", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setSelectedNote(data.note);
    },
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "general" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNote.mutate(formData);
  };

  const handleSummarize = async () => {
    if (!selectedNote) return;
    setIsSummarizing(true);
    try {
      await summarizeNote.mutateAsync({ noteId: selectedNote.id });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#8174A0" }}>
            Smart Notes
          </h2>
          <p className="text-muted-foreground mt-1">
            Write, organize, and summarize your study materials with AI
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          data-testid="button-add-note"
          className="rounded-full px-6 py-6 text-white font-semibold shadow-lg"
          style={{ backgroundColor: "#8174A0" }}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">All Notes</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notes?.length === 0 ? (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No notes yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notes?.map((note) => (
                <Card
                  key={note.id}
                  data-testid={`note-card-${note.id}`}
                  onClick={() => setSelectedNote(note)}
                  className={`rounded-2xl cursor-pointer transition-all hover-elevate ${
                    selectedNote?.id === note.id ? "ring-2 ring-primary shadow-lg" : "shadow-md"
                  }`}
                  style={{
                    backgroundColor: selectedNote?.id === note.id ? "#FEE2AD" : "#FFF2EF",
                  }}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1 line-clamp-1">{note.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.content}
                    </p>
                    {note.category && (
                      <span
                        className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#A888B5", color: "white" }}
                      >
                        {note.category}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Note Detail */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {selectedNote.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNote.mutate(selectedNote.id)}
                    data-testid="button-delete-note"
                    className="rounded-full text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Original Content */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Original Notes
                  </h4>
                  <div
                    className="p-4 rounded-xl whitespace-pre-wrap"
                    style={{ backgroundColor: "#FFF2EF" }}
                  >
                    {selectedNote.content}
                  </div>
                </div>

                {/* AI Summary Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: "#8174A0" }} />
                      AI Summary
                    </h4>
                    <Button
                      size="sm"
                      onClick={handleSummarize}
                      data-testid="button-summarize"
                      disabled={isSummarizing || summarizeNote.isPending}
                      className="rounded-full text-white"
                      style={{ backgroundColor: "#8174A0" }}
                    >
                      {isSummarizing || summarizeNote.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {selectedNote.summary ? "Regenerate" : "Generate Summary"}
                        </>
                      )}
                    </Button>
                  </div>
                  {selectedNote.summary ? (
                    <div
                      className="p-4 rounded-xl border-l-4"
                      style={{
                        backgroundColor: "#FEE2AD",
                        borderLeftColor: "#8174A0",
                      }}
                    >
                      <p className="whitespace-pre-wrap">{selectedNote.summary}</p>
                    </div>
                  ) : (
                    <div
                      className="p-8 rounded-xl text-center"
                      style={{ backgroundColor: "#FFF2EF" }}
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: "#8174A0" }} />
                      <p className="text-muted-foreground text-sm">
                        Click "Generate Summary" to create an AI-powered summary
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-16 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No note selected</h3>
                <p className="text-muted-foreground">
                  Select a note from the list to view and summarize
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                data-testid="input-note-title"
                placeholder="e.g., Database Normalization"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-category">Category</Label>
              <Input
                id="note-category"
                data-testid="input-note-category"
                placeholder="e.g., lecture, assignment, general"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content">Content *</Label>
              <Textarea
                id="note-content"
                data-testid="input-note-content"
                placeholder="Type or paste your notes here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="rounded-xl min-h-48"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                data-testid="button-cancel-note"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-note"
                disabled={createNote.isPending}
                className="flex-1 rounded-full text-white"
                style={{ backgroundColor: "#8174A0" }}
              >
                {createNote.isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
