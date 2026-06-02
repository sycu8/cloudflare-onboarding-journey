import { z } from 'zod';

export const languageSchema = z.union([z.literal('vi'), z.literal('en')]).default('vi');

export const primaryInterestSchema = z.union([
  z.literal('application-services'),
  z.literal('developer-platform'),
  z.literal('cloudflare-one'),
  z.literal('not-sure'),
]);

export const workshopEventFormatSchema = z.union([
  z.literal('online'),
  z.literal('in-person'),
  z.literal('hybrid'),
]);

export const workshopEventStatusSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('cancelled'),
]);

export const workshopEventCreateSchema = z.object({
  titleVi: z.string().trim().min(3).max(160),
  titleEn: z.string().trim().min(3).max(160),
  descriptionVi: z.string().trim().max(2000).optional().or(z.literal('')),
  descriptionEn: z.string().trim().max(2000).optional().or(z.literal('')),
  startsAt: z
    .string()
    .trim()
    .min(10)
    .max(40)
    .refine((s) => !Number.isNaN(Date.parse(s)), { message: 'invalid_datetime' }),
  endsAt: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(''))
    .refine((s) => !s || !Number.isNaN(Date.parse(s)), { message: 'invalid_datetime' }),
  timezone: z.string().trim().min(2).max(64).default('Asia/Ho_Chi_Minh'),
  format: workshopEventFormatSchema.default('online'),
  locationVi: z.string().trim().max(240).optional().or(z.literal('')),
  locationEn: z.string().trim().max(240).optional().or(z.literal('')),
  meetingUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  capacity: z.number().int().min(1).max(10_000).optional(),
  primaryInterest: primaryInterestSchema.optional(),
  status: workshopEventStatusSchema.default('published'),
});

export const workshopSignupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  role: z.string().trim().max(120).optional().or(z.literal('')),
  primaryInterest: primaryInterestSchema,
  eventId: z.string().trim().min(4).max(80).optional(),
  question: z.string().trim().max(800).optional().or(z.literal('')),
  language: languageSchema,
  sourcePath: z.string().trim().max(200).optional(),
  utm_source: z.string().trim().max(100).optional(),
  utm_medium: z.string().trim().max(100).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  turnstileToken: z.string().trim().min(10).max(5000),
});

export const quizSubmissionSchema = z.object({
  quizId: z.string().trim().min(1).max(80),
  score: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().min(1).max(50),
  selectedPath: z.string().trim().max(120).optional(),
  language: languageSchema,
});

export const feedbackSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal('')),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(5).max(1200),
  pagePath: z.string().trim().max(200).optional(),
  language: languageSchema,
  turnstileToken: z.string().trim().min(10).max(5000).optional(),
});

