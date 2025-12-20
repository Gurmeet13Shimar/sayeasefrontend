import { LayoutDashboard, CheckSquare, BookText, BookHeart, Heart } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "planner", label: "Planner", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: BookText },
  { id: "journal", label: "Journal", icon: BookHeart },
  { id: "wellness", label: "Wellness", icon: Heart },
];

export default function Navigation({ activeSection, setActiveSection }) {
  return (
    <nav className="border-b" style={{ backgroundColor: "#FFF2EF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  isActive ? "shadow-md" : "hover-elevate"
                }`}
                style={{
                  backgroundColor: isActive ? "#FFBDBD" : "transparent",
                  color: isActive ? "#CD2C58" : "#8174A0",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
