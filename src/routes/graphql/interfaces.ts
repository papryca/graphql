import DataLoader from "dataloader";
import {MemberType, Post, PrismaClient, Profile} from "@prisma/client";
import {UUID} from "node:crypto";
import {MemberTypeId} from "../member-types/schemas.js";
import {User} from "./types/UserType.js"

export interface Context {
  prisma: PrismaClient;
  profileLoader: DataLoader<string, Profile | null>;
  postLoader: DataLoader<string, Post[] | null>;
  userLoader: DataLoader<string, User | null>;
  memberLoader: DataLoader<string, MemberType | null>;
}
export interface CreateUserDto {
  name: string;
  balance: number;
}
export interface CreateProfileDto {
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: MemberTypeId;
}
export interface CreatePostDto {
  title: string;
  content: string;
  authorId: UUID;
}
export interface ChangeUserDto {
  name?: string;
  balance?: number;
}
export interface ChangePostInputDto {
  title?:string;
  content?:string;
}
export interface ChangeProfileInputDto {
  isMale?: boolean;
  yearOfBirth?: number;
  memberTypeId?: MemberTypeId;
}
