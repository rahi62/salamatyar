// Auth API service - Simulated for testing (no backend required)

const SIMULATED_OTP = "12345";
const USERS_STORAGE_KEY = "simulated_users";

// Helper to get simulated users from localStorage
function getSimulatedUsers(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Helper to save simulated users
function saveSimulatedUsers(users: any[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Generate a JWT-like token (simulated) - handles Unicode/Persian characters
function generateToken(user: any): string {
  const payload = JSON.stringify({ ...user, iat: Date.now() });
  // Use TextEncoder/TextDecoder for proper Unicode handling
  const utf8Payload = unescape(encodeURIComponent(payload));
  const b64 = btoa(utf8Payload);
  return `simulated_jwt_${b64}.${Date.now()}`;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    fullName?: string;
    email?: string;
    isVerified: boolean;
    createdAt: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Generate OTP (simulated - always returns 12345)
export function generateOtp(): string {
  return SIMULATED_OTP;
}

// Send OTP for registration
export async function sendRegistrationOtp(
  phone: string
): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate phone format
  if (!phone.startsWith("09") || phone.length !== 11) {
    return {
      success: false,
      message: "شماره موبایل معتبر نیست",
    };
  }

  // Check if phone already registered
  const users = getSimulatedUsers();
  const existingUser = users.find((u: any) => u.phone === phone);
  if (existingUser) {
    return {
      success: false,
      message: "این شماره موبایل قبلاً ثبت شده است",
    };
  }

  return {
    success: true,
    message: `کد اعتبارسنجی (${SIMULATED_OTP}) به ${phone} ارسال شد`,
  };
}

// Register with OTP - only validates, doesn't store user yet
export async function registerWithOtp(
  phone: string,
  fullName: string,
  otp: string
): Promise<ApiResponse<AuthResponse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate OTP
  if (otp !== SIMULATED_OTP) {
    return {
      success: false,
      message: "کد اعتبارسنجی اشتباه است",
    };
  }

  // Check if phone already registered
  const users = getSimulatedUsers();
  const existingUser = users.find((u: any) => u.phone === phone);
  if (existingUser) {
    return {
      success: false,
      message: "این شماره موبایل قبلاً ثبت شده است",
    };
  }

  // Validate full name
  if (!fullName || fullName.trim().length < 3) {
    return {
      success: false,
      message: "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد",
    };
  }

  // Create new user (but don't store yet - frontend will store after confirmation)
  const newUser = {
    id: String(Date.now()),
    phone,
    fullName,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  const token = generateToken(newUser);

  return {
    success: true,
    data: {
      token,
      user: newUser,
    },
  };
}

// Finalize registration - stores the user after successful OTP verification
export async function finalizeRegistration(
  phone: string,
  fullName: string,
  otp: string
): Promise<ApiResponse<AuthResponse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate OTP
  if (otp !== SIMULATED_OTP) {
    return {
      success: false,
      message: "کد اعتبارسنجی اشتباه است",
    };
  }

  // Check if phone already registered
  const users = getSimulatedUsers();
  const existingUser = users.find((u: any) => u.phone === phone);
  if (existingUser) {
    return {
      success: false,
      message: "این شماره موبایل قبلاً ثبت شده است",
    };
  }

  // Validate full name
  if (!fullName || fullName.trim().length < 3) {
    return {
      success: false,
      message: "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد",
    };
  }

  // Create new user and store immediately
  const newUser = {
    id: String(Date.now()),
    phone,
    fullName,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveSimulatedUsers(users);

  const token = generateToken(newUser);

  return {
    success: true,
    data: {
      token,
      user: newUser,
    },
  };
}

// Send OTP for login
export async function sendLoginOtp(phone: string): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate phone format
  if (!phone.startsWith("09") || phone.length !== 11) {
    return {
      success: false,
      message: "شماره موبایل معتبر نیست",
    };
  }

  // Check if user exists
  const users = getSimulatedUsers();
  const existingUser = users.find((u: any) => u.phone === phone);
  if (!existingUser) {
    return {
      success: false,
      message: "کاربری با این شماره موبایل یافت نشد",
    };
  }

  return {
    success: true,
    message: `کد اعتبارسنجی (${SIMULATED_OTP}) به ${phone} ارسال شد`,
  };
}

// Login with OTP
export async function loginWithOtp(
  phone: string,
  otp: string
): Promise<ApiResponse<AuthResponse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate OTP
  if (otp !== SIMULATED_OTP) {
    return {
      success: false,
      message: "کد اعتبارسنجی اشتباه است",
    };
  }

  // Find user
  const users = getSimulatedUsers();
  const user = users.find((u: any) => u.phone === phone);
  if (!user) {
    return {
      success: false,
      message: "کاربری با این شماره موبایل یافت نشد",
    };
  }

  const token = generateToken(user);

  return {
    success: true,
    data: {
      token,
      user,
    },
  };
}

// Get current user profile
export async function getCurrentUser(
  token: string
): Promise<ApiResponse<any>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validate token (simulated)
  if (!token || !token.startsWith("simulated_jwt_")) {
    return {
      success: false,
      message: "توکن معتبر نیست",
    };
  }

  try {
    const users = getSimulatedUsers();
    // In a real app, we'd decode the JWT to get the user ID
    // For simulation, we'll just return the first user as example
    // The frontend handles this by storing user data in localStorage
    return {
      success: true,
      data: { message: "User authenticated" },
    };
  } catch {
    return {
      success: false,
      message: "خطا در دریافت اطلاعات کاربر",
    };
  }
}

// Update user profile
export async function updateProfile(
  token: string,
  data: { fullName?: string; email?: string }
): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate token (simulated)
  if (!token || !token.startsWith("simulated_jwt_")) {
    return {
      success: false,
      message: "توکن معتبر نیست",
    };
  }

  // Update user in storage
  const users = getSimulatedUsers();
  const userId = "1"; // In real app, decode from JWT
  const userIndex = users.findIndex((u: any) => u.id === userId);

  if (userIndex !== -1) {
    if (data.fullName) users[userIndex].fullName = data.fullName;
    if (data.email) users[userIndex].email = data.email;
    saveSimulatedUsers(users);
  }

  return {
    success: true,
    message: "پروفایل با موفقیت بروزرسانی شد",
  };
}

// Logout (invalidate token)
export async function logout(token: string): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    message: "خروج با موفقیت انجام شد",
  };
}

// Verify OTP (for general verification)
export async function verifyOtp(
  phone: string,
  otp: string
): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate OTP
  if (otp !== SIMULATED_OTP) {
    return {
      success: false,
      message: "کد اعتبارسنجی اشتباه است",
    };
  }

  return {
    success: true,
    message: "کد اعتبارسنجی تایید شد",
  };
}

// Clear pending registration (remove user from storage)
export async function clearRegistration(phone: string): Promise<ApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const users = getSimulatedUsers();
  const filteredUsers = users.filter((u: any) => u.phone !== phone);
  saveSimulatedUsers(filteredUsers);

  return {
    success: true,
    message: "ثبت نام لغو شد",
  };
}
