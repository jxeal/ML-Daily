import { Link, useRoute } from "wouter";
import { Home, Grid, BarChart2, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
  const [isHome] = useRoute("/");
  const [isCategories] = useRoute("/categories");
  const [isProgress] = useRoute("/progress");
  const [isProfile] = useRoute("/profile");

  const navItems = [
    { href: "/", icon: Home, label: "Home", active: isHome },
    { href: "/categories", icon: Grid, label: "Explore", active: isCategories },
    { href: "/progress", icon: BarChart2, label: "Progress", active: isProgress },
    { href: "/profile", icon: User, label: "Profile", active: isProfile },
  ];

  return (
    <div className="fixed bottom-0 w-full z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <nav className="mx-auto max-w-md bg-card/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl pointer-events-auto flex items-center justify-between relative overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link key={item.href} href={item.href} className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 rounded-2xl tap-highlight-transparent group">
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
