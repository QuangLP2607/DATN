import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import AppError from "@/core/AppError";
import { Role } from "@/interfaces/user";
import { getModelByRole } from "@/utils/getModelByRole";
import { ChangePasswordInput } from "./dto/changePassword";
import { SearchUsersInput } from "./dto/searchUsers";
import { UpdateProfileSchema, UpdateProfileInput } from "./dto/updateProfile";
import { GetUserByIdInput } from "./dto/getUserById";
import { AuthUser } from "@/types/auth";

export default {
  // ------------------------------ get profile ------------------------------
  getProfile: async (data: AuthUser) => {
    const Model = getModelByRole(data.role);
    const user = await Model.findById(data.id)
      .select("username email avatar_url -_id")
      .lean();
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  // ------------------------------ get full profile ------------------------------
  getFullProfile: async (data: AuthUser) => {
    const Model = getModelByRole(data.role);

    const user = await Model.findById(data.id)
      .select("-role -note -__v -_id")
      .lean();
    if (!user) throw AppError.notFound("User not found");

    return user;
  },

  // ------------------------------ update profile ------------------------------
  updateProfile: async <R extends Role>(
    user: AuthUser,
    data: UpdateProfileInput<R>
  ) => {
    const Model = getModelByRole(user.role);
    const safeData = UpdateProfileSchema.parse(data);
    const updated = await Model.findByIdAndUpdate(
      user.id,
      { $set: safeData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");
    if (!updated) throw AppError.notFound("User not found");
    return updated;
  },

  // ------------------------------ change password ------------------------------
  changePassword: async (id: string, data: ChangePasswordInput) => {
    const user = await UserModel.findById(id).select("+password");
    if (!user) throw AppError.notFound("User not found");
    const isMatch = await bcrypt.compare(data.oldPassword, user.password!);
    if (!isMatch) throw AppError.unauthorized("Old password is incorrect");
    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return true;
  },

  // ------------------------------ get user by id ------------------------------
  getUserById: async (data: GetUserByIdInput) => {
    const user = await UserModel.findById(data.id)
      .select("-password -__v")
      .lean();
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  // ------------------------------ search users ------------------------------
  searchUsers: async (data: SearchUsersInput) => {
    const { page, limit, sortBy, order, search, role } = data;
    const mongoQuery: Record<string, any> = {};

    if (role) {
      mongoQuery.role = role;
    }

    if (search?.trim()) {
      const keyword = search.trim();
      mongoQuery.$or = [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { full_name: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find(mongoQuery)
        .select("-password -__v")
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(mongoQuery),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
