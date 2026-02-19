import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type LoginInput = z.infer<typeof api.auth.login.input>;
type RegisterInput = z.infer<typeof api.auth.register.input>;
type User = { id: number; name: string; email: string };

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export function useLogin() {
  const { login } = useAuthStore();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      // Simulation for prototype since backend might not be fully wired
      // In real app: const res = await fetch(api.auth.login.path, ...);
      
      // Mock network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === "demo@example.com" && data.password === "password") {
         return { id: 1, name: "Demo User", email: "demo@example.com" };
      }
      
      // Attempt real fetch if mock fails
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      login(user, "mock-jwt-token");
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Login failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch(api.auth.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      login(user, "mock-jwt-token");
      toast({ title: "Account created", description: "Welcome to AI Interview Coach." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Registration failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
}
