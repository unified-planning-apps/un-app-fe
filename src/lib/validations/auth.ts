import { Region, Role } from '#/shared/constants';
import { z } from 'zod'

export const SigninFormSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."),
    password: z.string().min(6, { message: 'Invalid password.', })
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;


export const RegisterFormSchema = z.object({
    fullname: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    phoneNumber: z.string()
        .min(8, { message: 'Phone number must be at least 8 digits.' })
        .max(15, { message: 'Phone number must be at most 15 digits.' }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."),
    region: z.enum(Region, { message: 'Select a valid region.' }),
    role: z.enum(Role, { message: 'Select a valid role.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.', })
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.")
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;