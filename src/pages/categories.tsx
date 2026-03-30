import { AppLayout } from "@/components/layout/app-layout";
import { useGetCategories } from "@/hooks/use-supabase";
import { FolderKanban, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Categories() {
  const { data: categories, isLoading } = useGetCategories();

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Explore ML</h1>
          <p className="text-muted-foreground">Browse lessons by topic and difficulty.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card h-40 rounded-3xl border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
              >
                <Link href={`/?category=${cat.id}`} className="block group">
                  <div className="bg-card p-6 rounded-3xl border border-white/5 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden">
                    
                    {/* Color splash */}
                    <div 
                      className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: cat.color || 'var(--primary)' }}
                    />

                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="text-3xl">{cat.icon}</div>
                      <h3 className="text-xl font-display font-bold">{cat.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6 relative z-10 line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto relative z-10">
                      <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                        {cat.lesson_count} Lessons
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
