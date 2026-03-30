import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Lesson, Category, DailyChallenge, UserStats } from "@/types/database";
import { format } from "date-fns";
import { useAuth } from "@/components/auth/auth-provider";
import { checkBadges } from "@/lib/utils";

export function useGetLessons() {
  return useQuery<Lesson[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*");
      if (error) throw error;
      return data as Lesson[];
    },
  });
}

export function useGetLessonById(id: string) {
  return useQuery<Lesson>({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!id,
  });
}

export function useGetCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useGetDailyChallenge() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  return useQuery<DailyChallenge>({
    queryKey: ["daily-challenge", todayStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("date", todayStr)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        // Fallback to latest challenge if today's is not found
        const { data: latest, error: latestError } = await supabase
          .from("daily_challenges")
          .select("*")
          .order("date", { ascending: false })
          .limit(1)
          .single();
        if (latestError) throw latestError;
        return {
          ...latest,
          xpReward: latest.xp_reward
        } as DailyChallenge;
      }
      
      return {
        ...data,
        xpReward: data.xp_reward
      } as DailyChallenge;
    },
  });
}

export function useUserStats() {
  const { user } = useAuth();
  return useQuery<UserStats | null>({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        // Initialize stats if they don't exist
        const initialStats = {
          id: user.id,
          streak: 0,
          last_visit: null,
          completed_lessons: [],
          xp: 0,
          daily_challenge_done: null,
          badges: []
        };
        const { data: inserted, error: insertError } = await supabase
          .from("user_stats")
          .insert(initialStats)
          .select()
          .single();
        if (insertError) throw insertError;
        return inserted as UserStats;
      }
      
      return data as UserStats;
    },
    enabled: !!user,
  });
}

export function useUpdateUserStats() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<UserStats>) => {
      if (!user) throw new Error("User not authenticated");
      
      // Get current stats to check for badges
      const { data: current } = await supabase
        .from("user_stats")
        .select("*")
        .eq("id", user.id)
        .single();

      const newStats = { ...current, ...updates };
      const newBadges = checkBadges({
        streak: newStats.streak || 0,
        xp: newStats.xp || 0,
        completed_lessons: newStats.completed_lessons || []
      });

      const finalUpdates = {
        ...updates,
        badges: Array.from(new Set([...(current?.badges || []), ...newBadges]))
      };

      const { data, error } = await supabase
        .from("user_stats")
        .update(finalUpdates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data as UserStats;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats", user?.id] });
    },
  });
}
