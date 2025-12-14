export const Roles = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
} as const;

export type Role = keyof typeof Roles;

export interface IUserBase {
  username?: string;
  email: string;
  password?: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IAdmin extends IUserBase {}

export interface IStudent extends IUserBase {
  full_name?: string;
  avatar_url?: string;
  dob?: Date;
  phone?: string;
  address?: string;
  japaneseLevel?: "Không" | "N5" | "N4" | "N3" | "N2" | "N1";
  note?: string;
  lastLogin?: Date;
}

export interface ITeacher extends IUserBase {
  full_name?: string;
  avatar_url?: string;
  dob?: Date;
  phone?: string;
  address?: string;
  status?: "active" | "inactive" | "pending";
  note?: string;
}
