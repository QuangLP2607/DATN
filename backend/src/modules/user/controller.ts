import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "@/core/response";

export default {
  // ------------------------------ get profile ------------------------------
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const profile = await Service.getProfile(user);
      return Res.success(res, "Profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ get full profile ------------------------------
  getFullProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const profile = await Service.getFullProfile(user);
      return Res.success(res, "Full profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update profile --------------------
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      await Service.updateProfile(user, req.validated.body);
      return Res.success(res, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ change password ------------------------------
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      await Service.changePassword(user.id, req.validated.body);
      return Res.success(res, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ get user by id ------------------------------
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await Service.getUserById(req.validated.params);
      return Res.success(res, "Profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  },

  //-------------------- search users --------------------
  searchUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.searchUsers(req.validated.query);
      return Res.success(res, "Users fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },
};
