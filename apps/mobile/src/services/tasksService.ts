import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task, TaskStatus } from "@/stores/tasksStore";
import { api } from "./api";

const TASKS_KEY = ["tasks"] as const;

// ─── Fetch all tasks ───────────────────────────────────────────
export function useTasks() {
	return useQuery({
		queryKey: TASKS_KEY,
		queryFn: () => api.get<Task[]>("/tasks"),
	});
}

// ─── Fetch single task ─────────────────────────────────────────
export function useTask(id: string) {
	return useQuery({
		queryKey: [...TASKS_KEY, id],
		queryFn: () => api.get<Task>(`/tasks/${id}`),
		enabled: !!id,
	});
}

// ─── Create task ───────────────────────────────────────────────
interface CreateTaskPayload {
	title: string;
	description?: string;
}

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateTaskPayload) =>
			api.post<Task>("/tasks", payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}

// ─── Update task status ────────────────────────────────────────
export function useUpdateTaskStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
			api.put<Task>(`/tasks/${id}`, { status }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}

// ─── Delete task ───────────────────────────────────────────────
export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.delete<void>(`/tasks/${id}`),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
	});
}
