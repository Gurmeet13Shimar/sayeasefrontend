import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, BookHeart, TrendingUp, Clock, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard({ user }) {
  // Fetch stats from backend
  const { data: tasks } = useQuery({ queryKey: ["/api/tasks"] });
  const { data: notes } = useQuery({ queryKey: ["/api/notes"] });
  const { data: journals } = useQuery({ queryKey: ["/api/journals"] });

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const upcomingTasks = tasks?.filter(t => !t.completed).slice(0, 3) || [];
  const recentNotes = notes?.slice(0, 3) || [];
  const recentJournal = journals?.[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-8 shadow-lg"
           style={{ 
             background: "linear-gradient(135deg, #FFBDBD 0%, #FFA4A4 50%, #A888B5 100%)"
           }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2" 
                style={{ fontFamily: "Outfit, sans-serif", color: "#FFF2EF" }}>
              Welcome back, {user?.username}!
            </h2>
            <p className="text-lg" style={{ color: "#FFF2EF" }}>
              Let's make today productive and positive
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: "#FFF2EF" }}>
              <Star className="w-12 h-12" style={{ color: "#CD2C58" }} />
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md hover-elevate" data-testid="card-tasks-stat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
            <CheckCircle2 className="w-5 h-5" style={{ color: "#CD2C58" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#CD2C58" }}>
              {completedTasks}/{totalTasks}
            </div>
            <Progress value={completionRate} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover-elevate" data-testid="card-notes-stat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notes Created
            </CardTitle>
            <FileText className="w-5 h-5" style={{ color: "#8174A0" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#8174A0" }}>
              {notes?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Study materials organized
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover-elevate" data-testid="card-journal-stat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Journal Entries
            </CardTitle>
            <BookHeart className="w-5 h-5" style={{ color: "#B33791" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#B33791" }}>
              {journals?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Days of reflection tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "#CD2C58" }} />
              <span>Upcoming Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming tasks</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    data-testid={`task-preview-${task.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover-elevate"
                    style={{ backgroundColor: "#FFDCDC" }}
                  >
                    <div
                      className="w-1 h-full rounded-full"
                      style={{
                        backgroundColor:
                          task.priority === "high"
                            ? "#CD2C58"
                            : task.priority === "medium"
                            ? "#FFA4A4"
                            : "#A888B5",
                        minHeight: "40px",
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: "#8174A0" }} />
              <span>Recent Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notes yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start taking notes!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    data-testid={`note-preview-${note.id}`}
                    className="p-4 rounded-xl hover-elevate"
                    style={{ backgroundColor: "#FEE2AD" }}
                  >
                    <h4 className="font-medium mb-1">{note.title}</h4>
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Mood */}
      {recentJournal && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookHeart className="w-5 h-5" style={{ color: "#B33791" }} />
              <span>Today's Journal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#FDCFFA" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {recentJournal.mood === "happy" ? "😊" :
                   recentJournal.mood === "sad" ? "😢" :
                   recentJournal.mood === "excited" ? "🤩" :
                   recentJournal.mood === "stressed" ? "😰" : "😐"}
                </span>
                <span className="font-medium capitalize">{recentJournal.mood}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {recentJournal.content}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
