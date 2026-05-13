"use client";

import { useState, FormEvent } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  phoneSchema,
  otpSchema,
  registerSchema,
  fullNameRegex,
  PhoneFormData,
  OtpFormData,
  RegisterFormData,
  formatValidationErrors,
} from "@/lib/auth/validators";
import {
  sendRegistrationOtp,
  finalizeRegistration,
  generateOtp,
  verifyOtp,
  clearRegistration,
  ApiResponse,
} from "@/lib/auth/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "profile" | "success">(
    "phone",
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    // Validate phone
    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      setValidationErrors(formatValidationErrors(result.error.issues));
      return;
    }

    setIsLoading(true);
    setPhone(result.data.phone);

    try {
      const response = await sendRegistrationOtp(result.data.phone);

      if (response.success) {
        // Generate the same OTP for demo (in production, this would be sent via SMS)
        const otpCode = generateOtp();
        setGeneratedOtp(otpCode);
        setStep("otp");
        setSuccessMessage("کد اعتبارسنجی ارسال شد");
      } else {
        setError(response.message || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    // Validate OTP
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      setValidationErrors(formatValidationErrors(result.error.issues));
      return;
    }

    setIsLoading(true);
    setOtp(result.data.otp);

    try {
      const response = await verifyOtp(phone, result.data.otp);

      if (response.success) {
        setStep("profile");
      } else {
        setError(response.message || "کد اعتبارسنجی اشتباه است");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    // Validate full name
    if (!fullName || fullName.trim().length < 3) {
      setValidationErrors({ fullName: "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد" });
      return;
    }
    if (!fullNameRegex.test(fullName.trim())) {
      setValidationErrors({ fullName: "نام و نام خانوادگی معتبر نیست" });
      return;
    }

    console.log("Finalizing registration with:", { phone, fullName: fullName.trim(), otp });
    console.log("Current OTP state:", otp);
    console.log("Current phone state:", phone);
    setIsLoading(true);

    try {
      const response = await finalizeRegistration(
        phone,
        fullName.trim(),
        otp,
      );

      console.log("Registration response:", response);

      if (response.success && response.data) {
        // Store auth data only after successful final step
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        // Redirect to profile page
        router.push("/profile");
      } else {
        setError(response.message || "خطا در ثبت نام");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.message || err?.toString() || "خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    if (step === "otp") {
      // Clear pending registration when going back to phone step
      if (phone) {
        await clearRegistration(phone);
      }
      setPhone("");
      setStep("phone");
    } else if (step === "profile") {
      setStep("otp");
    }
    setError("");
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-600 text-white p-3 rounded-xl">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <span className="font-black text-2xl text-slate-900">
                سلامت‌<span className="text-primary-600">یار</span>
              </span>
              <span className="block text-xs text-slate-500 -mt-1">
                کلینیک تخصصی آنلاین
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["phone", "otp", "profile"].map((s, i) => {
              const stepOrder = ["phone", "otp", "profile"] as const;
              const currentIdx = stepOrder.indexOf(
                step as (typeof stepOrder)[number],
              );
              const stepIdx = stepOrder.indexOf(
                s as (typeof stepOrder)[number],
              );
              const isCompleted = stepIdx < currentIdx;
              const isCurrent = s === step;

              return (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`w-8 h-0.5 ${isCompleted ? "bg-primary-500" : "bg-slate-200"}`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${
                        isCompleted
                          ? "bg-primary-500 text-white"
                          : isCurrent
                            ? "bg-primary-100 text-primary-700 border-2 border-primary-500"
                            : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
                ثبت‌نام در سلامت‌یار
              </h2>
              <p className="text-center text-slate-500 text-sm mb-6">
                شماره موبایل خود را وارد کنید
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setValidationErrors({});
                      }}
                      className={`w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono text-end ${
                        validationErrors.phone
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="09123456789"
                      dir="ltr"
                      maxLength={11}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      ارسال کد اعتبارسنجی
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
                اعتبارسنجی
              </h2>
              <p className="text-center text-slate-500 text-sm mb-2">
                کد ارسال شده به{" "}
                <span className="font-bold text-slate-700" dir="ltr">
                  {phone}
                </span>{" "}
                را وارد کنید
              </p>
              <p className="text-center text-primary-600 text-xs mb-6 bg-primary-50 p-2 rounded-lg">
                کد اعتبارسنجی (دمو):{" "}
                <span className="font-bold font-mono" dir="ltr">
                  {generatedOtp}
                </span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    کد اعتبارسنجی
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 5));
                      setValidationErrors({});
                    }}
                    className={`w-full border rounded-xl px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono text-lg tracking-widest ${
                      validationErrors.otp
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    placeholder="• • • • •"
                    maxLength={5}
                    autoFocus
                  />
                  {validationErrors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.otp}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-bold transition-colors"
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 5}
                    className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "اعتبارسنجی"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Profile Step */}
          {step === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
                تکمیل پروفایل
              </h2>
              <p className="text-center text-slate-500 text-sm mb-6">
                نام خود را وارد کنید
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setValidationErrors({});
                      }}
                      className={`w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        validationErrors.fullName
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="محمد محمدی"
                    />
                  </div>
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-bold transition-colors"
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "ثبت‌نام"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                ثبت‌نام با موفقیت انجام شد
              </h2>
              <p className="text-slate-500 mb-8">
                حساب شما ایجاد شد و اکنون می‌توانید وارد شوید
              </p>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                ورود به حساب
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Login link */}
          {step !== "success" && (
            <div className="mt-6 text-center text-sm text-slate-500">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link
                href="/login"
                className="text-primary-600 font-bold hover:underline"
              >
                وارد شوید
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
