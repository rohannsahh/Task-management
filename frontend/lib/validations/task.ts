import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  priority: z.number().min(1).max(5),
  status: z.enum(["pending", "finished"]),
  startTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start time",
  }),
  endTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end time",
  }),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type TaskFormData = z.infer<typeof taskSchema>;