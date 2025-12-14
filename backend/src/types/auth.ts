import type { Role } from "@/interfaces/user";

export interface AuthUser<R extends Role = Role> {
  id: string;
  role: R;
}
