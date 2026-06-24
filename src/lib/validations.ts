import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(5).max(4000),
  source: z.string().default("contact"),
  productSlug: z.string().optional(),
  locale: z.string().default("id"),
  // Honeypot — must be empty.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const chatSchema = z.object({
  sessionId: z.string().nullable().optional(),
  body: z.string().min(1).max(2000),
  visitorName: z.string().max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
});
