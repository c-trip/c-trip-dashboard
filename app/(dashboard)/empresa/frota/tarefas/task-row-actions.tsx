"use client";

import { useTransition } from "react";

import { updateTaskStatusAction } from "./actions";
import type { TaskStatus } from "@/lib/api/types";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Por fazer" },
  { value: "in_progress", label: "Em curso" },
  { value: "done", label: "Concluída" },
];

interface TaskRowActionsProps {
  taskId: string;
  currentStatus: TaskStatus;
}

export function TaskRowActions({ taskId, currentStatus }: TaskRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      onChange={(event) => {
        const status = event.target.value;
        if (status === currentStatus) return;
        startTransition(async () => {
          await updateTaskStatusAction(taskId, status);
        });
      }}
      disabled={isPending}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
