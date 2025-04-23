export interface User {
  id: string
  email: string
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  confirmPassword: string
} 