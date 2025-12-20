import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Check, Trash2, Edit, Calendar } from "lucide-react";

export default function StudyPlanner({ user }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const { data: tasks, isLoading } = useQuery({ 
    queryKey: ["/api/tasks"],
  });

  const createTask = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...data }) => apiRequest("PATCH", `/api/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setEditingTask(null);
      resetForm();
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const toggleComplete = (task) => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", dueDate: "", priority: "medium" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...formData });
    } else {
      createTask.mutate(formData);
    }
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      priority: task.priority,
    });
  };

  const filteredTasks = tasks?.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#CD2C58" }}>
            Study Planner
          </h2>
          <p className="text-muted-foreground mt-1">
            Organize your assignments, exams, and study goals
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          data-testid="button-add-task"
          className="rounded-full px-6 py-6 text-white font-semibold shadow-lg"
          style={{ backgroundColor: "#CD2C58" }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "completed"].map((filterType) => (
          <button
            key={filterType}
            data-testid={`filter-${filterType}`}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              filter === filterType ? "shadow-md" : "hover-elevate"
            }`}
            style={{
              backgroundColor: filter === filterType ? "#FFBDBD" : "#FFF2EF",
              color: filter === filterType ? "#CD2C58" : "#8174A0",
            }}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground">
              {filter === "completed" 
                ? "No completed tasks to show" 
                : "Start adding tasks to organize your study life"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              data-testid={`task-card-${task.id}`}
              className={`rounded-2xl shadow-md hover-elevate transition-all ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Priority Indicator */}
                  <div
                    className="w-1 h-20 rounded-full"
                    style={{
                      backgroundColor:
                        task.priority === "high"
                          ? "#CD2C58"
                          : task.priority === "medium"
                          ? "#FFA4A4"
                          : "#A888B5",
                    }}
                  />

                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>
                      <button
                        onClick={() => toggleComplete(task)}
                        data-testid={`button-complete-${task.id}`}
                        className={`rounded-full p-1 transition-colors ${
                          task.completed ? "bg-green-500" : "bg-gray-200 hover:bg-green-100"
                        }`}
                      >
                        <Check className={`w-4 h-4 ${task.completed ? "text-white" : "text-gray-400"}`} />
                      </button>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {task.dueDate && (
                        <span
                          className="text-xs px-3 py-1 rounded-full"
                          style={{ backgroundColor: "#FFDCDC", color: "#CD2C58" }}
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className="text-xs px-3 py-1 rounded-full capitalize"
                        style={{
                          backgroundColor:
                            task.priority === "high"
                              ? "#FFBDBD"
                              : task.priority === "medium"
                              ? "#FEE2AD"
                              : "#FDCFFA",
                          color: "#CD2C58",
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(task)}
                        data-testid={`button-edit-${task.id}`}
                        className="rounded-full"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask.mutate(task.id)}
                        data-testid={`button-delete-${task.id}`}
                        className="rounded-full text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Task Dialog */}
      <Dialog open={isAddDialogOpen || editingTask !== null} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setEditingTask(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                data-testid="input-task-title"
                placeholder="e.g., Complete DBMS notes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                data-testid="input-task-description"
                placeholder="Add details about this task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  data-testid="input-task-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="task-priority" data-testid="select-task-priority" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingTask(null);
                  resetForm();
                }}
                data-testid="button-cancel"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-task"
                disabled={createTask.isPending || updateTask.isPending}
                className="flex-1 rounded-full text-white"
                style={{ backgroundColor: "#CD2C58" }}
              >
                {createTask.isPending || updateTask.isPending ? "Saving..." : "Save Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
