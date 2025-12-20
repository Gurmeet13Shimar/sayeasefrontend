import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, TrendingUp } from "lucide-react";

const moodOptions = [
  { value: "happy", emoji: "😊", label: "Happy", color: "#FFA4A4" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "#A888B5" },
  { value: "sad", emoji: "😢", label: "Sad", color: "#8174A0" },
  { value: "excited", emoji: "🤩", label: "Excited", color: "#FFBDBD" },
  { value: "stressed", emoji: "😰", label: "Stressed", color: "#CD2C58" },
];

export default function Journal({ user }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    mood: "neutral",
    activities: "",
  });

  const { data: journals, isLoading } = useQuery({ 
    queryKey: ["/api/journals"],
  });

  const createJournal = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/journals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({ content: "", mood: "neutral", activities: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createJournal.mutate(formData);
  };

  const getMoodStats = () => {
    if (!journals || journals.length === 0) return null;

    const moodCounts = journals.reduce((acc, journal) => {
      acc[journal.mood] = (acc[journal.mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    return {
      total: journals.length,
      mostCommonMood: mostCommon[0],
      mostCommonCount: mostCommon[1],
    };
  };

  const stats = getMoodStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#B33791" }}>
            Daily Journal
          </h2>
          <p className="text-muted-foreground mt-1">
            Track your daily activities, feelings, and reflections
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          data-testid="button-add-journal"
          className="rounded-full px-6 py-6 text-white font-semibold shadow-lg"
          style={{ backgroundColor: "#B33791" }}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Stats Card */}
      {stats && (
        <Card className="rounded-2xl shadow-md" style={{ backgroundColor: "#FDCFFA" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: "#B33791" }} />
              <span>Weekly Insight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: "#B33791" }}>
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Entries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl">
                  {moodOptions.find(m => m.value === stats.mostCommonMood)?.emoji}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Most Common Mood</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: "#B33791" }}>
                  {Math.round((stats.mostCommonCount / stats.total) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Frequency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : journals?.length === 0 ? (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
            <p className="text-muted-foreground">
              Start reflecting on your day and track your progress
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {journals?.map((journal) => {
            const mood = moodOptions.find(m => m.value === journal.mood);
            return (
              <Card
                key={journal.id}
                data-testid={`journal-card-${journal.id}`}
                className="rounded-2xl shadow-md hover-elevate"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Mood Emoji */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: mood?.color + "30" }}
                    >
                      {mood?.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {new Date(journal.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="text-base mb-3 whitespace-pre-wrap">
                        {journal.content}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: mood?.color }}
                        >
                          Feeling {mood?.label}
                        </span>
                        {journal.activities && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: "#FEE2AD", color: "#8174A0" }}
                          >
                            {journal.activities}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Journal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
              New Journal Entry
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>How are you feeling today?</Label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    data-testid={`mood-${mood.value}`}
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`p-4 rounded-2xl text-center transition-all hover-elevate ${
                      formData.mood === mood.value ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                    style={{
                      backgroundColor: formData.mood === mood.value ? mood.color + "50" : "#FFF2EF",
                    }}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="journal-content">What happened today? *</Label>
              <Textarea
                id="journal-content"
                data-testid="input-journal-content"
                placeholder="Reflect on your day, studies, challenges, or achievements..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="rounded-xl min-h-40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="journal-activities">Activities (optional)</Label>
              <input
                id="journal-activities"
                data-testid="input-journal-activities"
                type="text"
                placeholder="e.g., Studied math, Gym, Reading"
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-input focus:border-primary outline-none"
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
                data-testid="button-cancel-journal"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-journal"
                disabled={createJournal.isPending}
                className="flex-1 rounded-full text-white"
                style={{ backgroundColor: "#B33791" }}
              >
                {createJournal.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
