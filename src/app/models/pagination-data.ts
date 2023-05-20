import { User } from "./user";

export interface PaginationData{
  totalPages: number,
  users: User[] 
}