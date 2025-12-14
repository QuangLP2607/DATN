export type Role = "ADMIN" | "STUDENT" | "TEACHER";

export interface User {
  id: string;
  username?: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student extends User {
  full_name?: string;
  avatar_url?: string;
  dob?: string;
  phone?: string;
  address?: string;
  japaneseLevel?: "Không" | "N5" | "N4" | "N3" | "N2" | "N1";
  note?: string;
  lastLogin?: string;
}

export interface Teacher extends User {
  full_name?: string;
  avatar_url?: string;
  dob?: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive" | "pending";
  note?: string;
}

// export interface Admin extends User {}
