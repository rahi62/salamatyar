import { z } from 'zod';

// Iranian phone number validation
export const phoneSchema = z.object({
  phone: z.string()
    .min(11, 'شماره تماس باید حداقل ۱۱ رقم باشد')
    .max(11, 'شماره تماس باید حداکثر ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست. مثال: 09123456789')
});

export type PhoneFormData = z.infer<typeof phoneSchema>;

// OTP validation
export const otpSchema = z.object({
  otp: z.string()
    .min(5, 'کد اعتبارسنجی باید ۵ رقم باشد')
    .max(5, 'کد اعتبارسنجی باید ۵ رقم باشد')
    .regex(/^\d{5}$/, 'کد اعتبارسنجی باید ۵ رقم باشد')
});

export type OtpFormData = z.infer<typeof otpSchema>;

// Login form validation
export const loginSchema = z.object({
  phone: z.string()
    .min(1, 'شماره تماس الزامی است')
    .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست. مثال: 09123456789')
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form validation
export const registerSchema = z.object({
  phone: z.string()
    .min(1, 'شماره تماس الزامی است')
    .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست. مثال: 09123456789'),
  fullName: z.string()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد')
    .max(100, 'نام و نام خانوادگی نباید بیشتر از ۱۰۰ کاراکتر باشد')
});

// Full name validation that accepts Persian, Arabic, and Latin characters
export const fullNameRegex = /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB80-\uFDFF\uFE70-\uFEFF\s\u200C\u200D]+$/;

export type RegisterFormData = z.infer<typeof registerSchema>;

// Profile update validation
export const profileSchema = z.object({
  fullName: z.string()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد')
    .max(100, 'نام و نام خانوادگی نباید بیشتر از ۱۰۰ کاراکتر باشد')
    .regex(fullNameRegex, 'نام و نام خانوادگی معتبر نیست')
    .optional(),
  email: z.string()
    .email('ایمیل معتبر نیست')
    .optional()
    .nullable()
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Validation error helper
export function formatValidationErrors(errors: any): Record<string, string> {
  const formatted: Record<string, string> = {};
  if (Array.isArray(errors)) {
    errors.forEach((error: any) => {
      if (error.path && error.message) {
        formatted[error.path[0]] = error.message;
      }
    });
  }
  return formatted;
}
