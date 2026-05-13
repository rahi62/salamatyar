"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, Loader2, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { profileSchema, formatValidationErrors, ProfileFormData } from "@/lib/auth/validators";
import { useRouter } from "next/navigation";



export default function ProfilePage() {
  
    const { user, token, updateUser, logout } = useAuth();
    const router = useRouter();
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({ fullName: "", email: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");
    setSuccess("");

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      setValidationErrors(formatValidationErrors(result.error.issues));
      return;
    }


    setFormLoading(true);
    try {
      // Replace with your actual API endpoint
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error(await res.text());
      
      const updatedUser = await res.json();
      updateUser(updatedUser);
      setSuccess("پروفایل با موفقیت بروزرسانی شد");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بروزرسانی پروفایل");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">پروفایل کاربری</h1>
        </div>
     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">
                {formData.fullName || "کاربر سلامت‌یار"}
              </h2>
              <p className="text-sm text-slate-500 mt-1" dir="ltr">
                {user?.phone}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 text-right space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>تاریخ عضویت:</span>
                  <span dir="ltr" className="font-mono text-xs">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </span>
                </div>
                {user?.isVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید شده</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                اطلاعات پروفایل
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        setValidationErrors({});
                      }}
                      className={`w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        validationErrors.fullName
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="نام و نام خانوادگی"
                    />
                  </div>
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ایمیل (اختیاری)
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setValidationErrors({});
                    }}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      validationErrors.email ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {success}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        ذخیره تغییرات
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                عملیات حساب کاربری
              </h3>
              <div className="space-y-3">
                <Link
                  href="/book"
                  className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all"
                >
                  رزرو نوبت جدید
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 py-3 rounded-xl font-bold transition-all"
                >
                  خروج از حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}