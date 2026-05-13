import { Region, Role } from '#/shared/constants';
import { z } from 'zod'

export const SigninFormSchema = z.object({
    email: z.string()
        .min(1, "Email is required.")
        .email("Invalid email address."),
    password: z.string()
        .min(1, "Password is required.")
        .min(6, { message: 'Password must be at least 6 characters.' })
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;


export const RegisterFormSchema = z.object({
    fullname: z.string()
        .min(2, { message: 'Full name must be at least 2 characters.' })
        .max(100, { message: 'Full name must be at most 100 characters.' })
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes."),
    phoneNumber: z.string()
        .min(8, { message: 'Phone number must be at least 8 digits.' })
        .max(15, { message: 'Phone number must be at most 15 digits.' })
        .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format."),
    email: z.string()
        .min(1, "Email is required.")
        .email("Invalid email address."),
    region: z.nativeEnum(Region, { message: 'Select a valid region.' }),
    role: z.nativeEnum(Role, { message: 'Select a valid role.' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
