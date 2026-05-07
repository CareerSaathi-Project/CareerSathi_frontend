import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type User = { id: number; name: string; email: string };

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean; 

  login: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false, 

      login: (user, token) => set({ user, token }),

      logout: () =>
        set({ user: null, token: null }),

      setHydrated: () => set({ isHydrated: true }), 
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ================= LOGIN =================
export function useLogin() {
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate(); 

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.login(data);
      return res;
    },
    onSuccess: (data) => {
      login(data.user, data.access_token);

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });

      navigate("/"); 
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ================= REGISTER =================
export function useRegister() {
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const res = await api.register(data);
      return res;
    },
    onSuccess: (data) => {
      login(data.user, data.access_token);

      toast({
        title: "Account created",
        description: "Welcome to AI Interview Coach.",
      });

      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}