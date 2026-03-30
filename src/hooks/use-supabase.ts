import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Lesson, Category, DailyChallenge } from "@/types/database";
import { format } from "date-fns";

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
        .single();
      
      if (error) {
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
