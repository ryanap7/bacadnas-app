// ─── User Types ────────────────────────────────────────────
export interface User {
  id: string;
  nik: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth Request/Response ─────────────────────────────────
export interface LoginRequest {
  nik: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // seconds
  };
}

export interface VerifyTokenResponse {
  success: boolean;
  data: {
    valid: boolean;
    user?: User;
  };
}

// ─── Auth State ────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Auth Actions ──────────────────────────────────────────
export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };
