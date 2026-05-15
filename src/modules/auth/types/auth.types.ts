export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminUserResponse {
  username: string;
  role: "admin";
}

export interface AdminLoginResponse {
  authenticated: boolean;
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: AdminUserResponse;
}
