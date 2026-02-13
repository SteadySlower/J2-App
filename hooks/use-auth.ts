import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAuth = () => {
  const {
    data: session,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refetch();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
};
