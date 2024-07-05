import { User } from "./user";

export interface AuthenticatedUserResponse {
  token: string;
  user: User;
}
