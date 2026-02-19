import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes"; // Assuming this is where api definition lives
import { z } from "zod";

// Types derived from API schema
type CreateInterviewInput = z.infer<typeof api.interviews.create.input>;
type InterviewResponse = z.infer<typeof api.interviews.create.responses[201]>;

export function useInterviews() {
  return useQuery({
    queryKey: [api.interviews.list.path],
    queryFn: async () => {
      const res = await fetch(api.interviews.list.path);
      if (!res.ok) throw new Error("Failed to fetch interviews");
      return await res.json();
    },
  });
}

export function useInterview(id: number) {
  return useQuery({
    queryKey: [api.interviews.get.path, id],
    queryFn: async () => {
      const res = await fetch(api.interviews.get.path.replace(":id", id.toString()));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch interview");
      return await res.json();
    },
    enabled: !!id,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInterviewInput) => {
      const res = await fetch(api.interviews.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create interview");
      return (await res.json()) as InterviewResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interviews.list.path] });
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: [api.analytics.get.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.get.path);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return await res.json();
    },
  });
}
