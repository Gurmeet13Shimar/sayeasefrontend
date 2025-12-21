import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/components/Dashboard";
import StudyPlanner from "@/components/StudyPlanner";
import SmartNotes from "@/components/SmartNotes";
import Journal from "@/components/Journal";
import Wellness from "@/components/Wellness";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";

export default function HomePage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // localStorage.removeItem("user");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: "#FFBDBD" }}>
                <span className="text-xl font-bold" style={{ color: "#CD2C58" }}>S</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#CD2C58" }}>
                SayEase
              </h1>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full"
                   style={{ backgroundColor: "#FFDCDC" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                     style={{ backgroundColor: "#B33791" }}>
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="font-medium text-sm" style={{ color: "#CD2C58" }}>
                  {user?.username}
                </span>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={toggleDarkMode}
                data-testid="button-theme-toggle"
                className="rounded-full"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={handleLogout}
                data-testid="button-logout"
                className="rounded-full"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "dashboard" && <Dashboard user={user} />}
        {activeSection === "planner" && <StudyPlanner user={user} />}
        {activeSection === "notes" && <SmartNotes user={user} />}
        {activeSection === "journal" && <Journal user={user} />}
        {activeSection === "wellness" && <Wellness />}
      </main>
    </div>
  );
}
