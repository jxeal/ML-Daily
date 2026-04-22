import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Lesson, Category, DailyChallenge, UserStats, Badge } from "@/types/database";
import { format } from "date-fns";
import { useAuth } from "@/components/auth/auth-provider";
import { checkBadges } from "@/lib/utils";

export function useGetLessons() {
  return useQuery<Lesson[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*");
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
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useGetCategoryById(idOrName: string) {
  return useQuery<Category>({
    queryKey: ["categories", idOrName],
    queryFn: async () => {
      // First try by ID
      const { data: byId, error: errorId } = await supabase
        .from("categories")
        .select("*")
        .eq("id", idOrName)
        .maybeSingle();

      if (byId) return byId as Category;

      // If not found by ID, try by name (convert slug back to name approximation or just direct match)
      const nameMatch = idOrName.split("-").join(" ");
      const { data: byName, error: errorName } = await supabase
        .from("categories")
        .select("*")
        .ilike("name", nameMatch)
        .maybeSingle();

      if (byName) return byName as Category;
      
      if (errorId) throw errorId;
      if (errorName) throw errorName;
      
      throw new Error("Category not found");
    },
    enabled: !!idOrName,
  });
}

export function useGetLessonsByCategory(
  categoryName: string,
  categoryId?: string
) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", "category", categoryName, categoryId],
    queryFn: async () => {
      let query = supabase.from("lessons").select("*");

      if (categoryId && categoryName) {
        query = query.or(
          `category.ilike.${categoryName},category.eq.${categoryId}`
        );
      } else if (categoryName) {
        query = query.ilike("category", categoryName);
      } else if (categoryId) {
        query = query.eq("category", categoryId);
      } else {
        return [];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!categoryName || !!categoryId,
  });
}

export function useGetDailyChallenge() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
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
          xpReward: latest.xp_reward,
        } as DailyChallenge;
      }

      return {
        ...data,
        xpReward: data.xp_reward,
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
          badges: [],
          username: user.user_metadata?.username || null,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
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

export function useUserProfile(usernameOrId: string) {
  return useQuery<UserStats | null>({
    queryKey: ["user-profile", usernameOrId],
    queryFn: async () => {
      if (!usernameOrId) return null;

      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          usernameOrId
        );
      const query = isUuid
        ? `username.eq.${usernameOrId},id.eq.${usernameOrId}`
        : `username.eq.${usernameOrId}`;

      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .or(query)
        .maybeSingle();

      if (error) throw error;
      return data as UserStats;
    },
    enabled: !!usernameOrId,
  });
}

export function useGetBadges() {
  return useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("*");
      if (error) throw error;
      return data as Badge[];
    },
  });
}

export function useUpdateUserStats() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<UserStats>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_stats")
        .update(updates)
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
