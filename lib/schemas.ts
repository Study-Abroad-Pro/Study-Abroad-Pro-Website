import { z } from "zod";

/**
 * One schema shared by the client form and the server route, so a POST that
 * skips the UI is rejected by exactly the same rules the visitor saw.
 */

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20)
  .regex(/^[+()\d\s-]+$/, "Enter a valid phone number");

const base = {
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email address").max(160),
  source_path: z.string().max(300).optional(),
  utm: z.record(z.string()).optional(),
  // Spam controls: bots fill hidden fields and submit instantly.
  company: z.string().max(0).optional(),
  elapsed_ms: z.number().int().nonnegative().optional(),
};

export const quickLeadSchema = z.object({
  ...base,
  form_type: z.literal("quick"),
  preferred_country: z.string().max(80).optional(),
  preferred_course: z.string().max(120).optional(),
  // Optional extras the counselling form can be configured to collect
  // (see /admin/forms). Both are plain columns on `leads`.
  qualification: z.string().max(120).optional(),
  intake: z.string().max(60).optional(),
});

export const countryLeadSchema = z.object({
  ...base,
  form_type: z.literal("country"),
  preferred_country: z.string().min(2).max(80),
  preferred_course: z.string().max(120).optional(),
  qualification: z.string().max(120).optional(),
  intake: z.string().max(60).optional(),
});

export const contactLeadSchema = z.object({
  ...base,
  form_type: z.literal("contact"),
  message: z.string().trim().min(4, "Tell us how we can help").max(2000),
  preferred_country: z.string().max(80).optional(),
});

export const eligibilityLeadSchema = z.object({
  ...base,
  form_type: z.literal("eligibility"),
  preferred_country: z.string().min(2).max(80),
  preferred_course: z.string().min(2).max(120),
  qualification: z.string().min(2).max(120),
  year_completed: z.number().int().min(1960).max(2100).optional(),
  score: z.string().max(40).optional(),
  english_test: z.string().max(60).optional(),
  budget: z.string().max(60).optional(),
  intake: z.string().max(60).optional(),
  current_location: z.string().max(120).optional(),
});

export const leadSchema = z.discriminatedUnion("form_type", [
  quickLeadSchema,
  countryLeadSchema,
  contactLeadSchema,
  eligibilityLeadSchema,
]);

export type Lead = z.infer<typeof leadSchema>;
