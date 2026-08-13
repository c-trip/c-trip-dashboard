import { apiFetch } from "@/lib/api/client";

// GET /auth/me — o campo `role` é o papel legado em string, não o RBAC granular.
// Ver `lib/auth/permissions.ts` para o que decide o acesso de facto.
export interface Me {
  id: string;
  email: string;
  name: string;
  role: string; // "passenger" | "colaborador" | "admin"
}

export interface MyPermissions {
  user_id: string;
  permissions: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
}

export function login(input: LoginInput) {
  return apiFetch<LoginResult>("/auth/login", { method: "POST", body: input, auth: false });
}

export function loginWithGoogle(idToken: string) {
  return apiFetch<LoginResult>("/auth/google", {
    method: "POST",
    body: { id_token: idToken },
    auth: false,
  });
}

export function getMe() {
  return apiFetch<Me>("/auth/me");
}

export function getMyPermissions() {
  return apiFetch<MyPermissions>("/auth/my-permissions");
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

export function changePassword(input: ChangePasswordInput) {
  return apiFetch<{ message: string }>("/auth/change-password", { method: "POST", body: input });
}
