/**
 * @file app/lib/schemas/auth.schema.ts
 * @description Zod validation schemas for authentication forms, including login and user registration data constraints.
 */

import { z } from "zod";

/** Zod validation schema for user login credentials. */
export const loginSchema = z.object({
  email: z
    .string()
    .max(255, "Email is too long")
    .pipe(z.email("Please provide a valid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password is too long"),
});

/** Zod validation schema for user registration payloads with password confirmation. */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username is too long"),
    email: z
      .string()
      .max(255, "Email is too long")
      .pipe(z.email("Please provide a valid email address")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password is too long (max 72 characters)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** Zod validation schema for profile updates with optional password change matching. */
export const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username is too long")
      .optional(),
    email: z
      .string()
      .max(255, "Email is too long")
      .pipe(z.email("Please provide a valid email address"))
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password is too long (max 72 characters)")
      .or(z.literal(""))
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );
