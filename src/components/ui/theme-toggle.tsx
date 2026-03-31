import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "dark" | "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center h-8 w-16 rounded-full p-1 transition-colors duration-300",
        theme === "dark" ? "bg-gray-800" : "bg-gray-200"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          "absolute flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300",
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        )}
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-indigo-900" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </div>
      <div className="flex w-full justify-between px-2">
        <Sun className={cn("h-4 w-4", theme === "dark" ? "text-gray-600" : "text-transparent")} />
        <Moon className={cn("h-4 w-4", theme === "dark" ? "text-transparent" : "text-gray-400")} />
      </div>
    </button>
  );
}
