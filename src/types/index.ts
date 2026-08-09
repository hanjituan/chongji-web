export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Log {
  id: number;
  username: string;
  action: string;
  module: string;
  ip: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export interface LoginForm {
  username: string;
  password: string;
}
