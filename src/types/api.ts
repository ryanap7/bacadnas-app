/**
 * API Types & Interfaces
 * Updated dengan complete Profile API response
 */

// ─── Auth Types ──────────────────────────────────────────────
export interface LoginRequest {
  nik: string;
}

/**
 * User dari API Response (Profile Extended)
 */
export interface User {
  id: string;
  nik: string;
  fullName: string;
  birthPlace: string;
  birthDate: string; // ISO String dari API
  gender: 'MALE' | 'FEMALE';
  phone: string;
  whatsapp: string;
  expertise: string[]; // Array of strings
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  address: string;
  selectedProgram: 'KOMCAD' | 'BELA_NEGARA';
  programSelectedAt: string; // ISO String
  isVerified: boolean;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

/**
 * API Response untuk New User
 */
export interface NewUserResponse {
  status: 'new_user';
  message: string;
  requiresAction: 'register';
  data: {
    nik: string;
  };
}

/**
 * API Response untuk Success Login
 */
export interface SuccessLoginResponse {
  status: 'success';
  message: string;
  requiresAction: 'dashboard';
  data: {
    user: User;
    accessToken: string;
  };
}

/**
 * Combined Login Response
 */
export type LoginResponse = NewUserResponse | SuccessLoginResponse;

// ─── Profile Types ───────────────────────────────────────────
/**
 * Profile API Response
 * GET /api/v1/users/profile
 */
export interface ProfileResponse {
  status: 'success';
  message: string;
  data: User;
}


// ─── Registration Types ──────────────────────────────────────
export interface RegistrationRequest {
  nik: string;
  fullName: string;
  birthPlace: string;
  birthDate: string; // Format: YYYY-MM-DD
  gender: 'MALE' | 'FEMALE';
  phone: string;
  expertise: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  address: string;
  selectedProgram: 'KOMCAD' | 'BELA_NEGARA';
  agreedToTerms: boolean;
}

export interface RegistrationResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

// ─── API Response Types ──────────────────────────────────────
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  requiresAction?: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

// ─── Offline Queue Types ─────────────────────────────────────
export interface QueuedRequest {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
}

// ─── Network State ───────────────────────────────────────────
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}