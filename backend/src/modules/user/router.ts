import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { ChangePasswordSchema } from "./dto/changePassword";
import { SearchUsersSchema } from "./dto/searchUsers";
import { UpdateProfileSchema } from "./dto/updateProfile";
import { GetUserByIdSchema } from "./dto/getUserById";
import { roleMiddleware } from "@/middlewares/role";

const router = Router();

router.get("/me", authMiddleware, Controller.getProfile);

router.get("/me/full", authMiddleware, Controller.getFullProfile);

router.put(
  "/me",
  authMiddleware,
  validateZod({ body: UpdateProfileSchema }),
  Controller.updateProfile
);

router.patch(
  "/me/password",
  authMiddleware,
  validateZod({ body: ChangePasswordSchema }),
  Controller.changePassword
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: GetUserByIdSchema }),
  Controller.getUserById
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ query: SearchUsersSchema }),
  Controller.searchUsers
);

export default router;
