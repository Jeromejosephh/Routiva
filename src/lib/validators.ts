// src/lib/validators.ts
import { z } from "zod";

export const habitCreate = z.object({
  name: z.string().min(1).max(60),
  description: z.string().max(200).optional(),
  targetDays: z.number().int().min(1).max(7).optional(),
});

export const logCreate = z.object({
  date: z.coerce.date(),
  status: z.enum(["done", "skip", "fail"]).default("done"),
  note: z.string().max(200).optional(),
});
