"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, ArrowLeft, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { loginSchema, formatValidationErrors, LoginFormData } from "@/lib/auth/validators";
import { sendLoginOtp, loginWithOtp, ApiResponse } from "@/lib/auth/api";
import { useAuth } from "@/lib/auth/context";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { login } = useAuth();

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    const result = loginSchema.safeParse({ phone });
    if (!result.success) {
      setValidationErrors(formatValidationErrors(result.error.issues));
      return;
    }

    setIsLoading(true);
    setPhone(result.data.phone);

    try {
      const response = await sendLoginOtp(result.data.phone);

      if (response.success) {
        setStep("otp");
      } else {
        setError(response.message || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    const result = loginSchema.safeParse({ phone });
    if (!result.success) {
      setValidationErrors(formatValidationErrors(result.error.issues));
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginWithOtp(phone, otp);

      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        window.location.href = "/";
      } else {
        setError(response.message || "خطا در ورود");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
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
            {["phone", "otp"].map((s, i) => {
              const stepOrder = ["phone", "otp"] as const;
              const currentIdx = stepOrder.indexOf(step as typeof stepOrder[number]);
              const stepIdx = stepOrder.indexOf(s as typeof stepOrder[number]);
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
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
                ورود به سلامت‌یار
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      ارسال کد ورود
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
                ورود با کد اعتبارسنجی
              </h2>
              <p className="text-center text-slate-500 text-sm mb-6">
                کد ارسال شده به{" "}
                <span className="font-bold text-slate-700" dir="ltr">
                  {phone}
                </span>{" "}
                را وارد کنید
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
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
                    onClick={() => {
                      setStep("phone" as "phone" | "otp");
                      setError("");
                      setValidationErrors({});
                    }}
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
                      "ورود"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Register link */}
          <div className="mt-6 text-center text-sm text-slate-500">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/auth/register"
              className="text-primary-600 font-bold hover:underline"
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}