import { Types } from "mongoose";
import AppError from "@/core/AppError";
import LiveRoomModel from "@/models/LiveRoom";
import { UserModel } from "@/models/User";
import { generateJitsiToken, JitsiUser } from "@/services/jitsi";
import { CreateLiveRoomInput } from "./dto/create";
import { JoinLiveRoomInput } from "./dto/join";

export default {
  // -------------------- CREATE OR JOIN ROOM --------------------
  createRoom: async (input: CreateLiveRoomInput, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw AppError.notFound("User not found");
    const userObjectId = new Types.ObjectId(user._id);

    let room = await LiveRoomModel.findOne({
      classId: input.classId,
      status: "OPEN",
    });

    if (!room) {
      room = await LiveRoomModel.create({
        name: input.roomName,
        classId: input.classId,
        createdBy: userObjectId,
        participants: [userObjectId],
        teacherOnline: true,
        lastSeenTeacher: new Date(),
      });
    } else {
      if (!room.participants.some((id) => id.equals(userObjectId))) {
        room.participants.push(userObjectId);
        room.teacherOnline = true;
        room.lastSeenTeacher = new Date();
        await room.save();
      }
    }

    const jitsiUser: JitsiUser = {
      _id: user._id.toString(),
      role: user.role,
      name: user.username || "Guest",
      email: user.email,
    };

    const token = generateJitsiToken(jitsiUser, room._id.toString());

    return { roomId: room._id.toString(), token };
  },

  // -------------------- JOIN ROOM --------------------
  joinRoom: async (input: JoinLiveRoomInput, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw AppError.notFound("User not found");

    const room = await LiveRoomModel.findOne({ name: input.roomName });
    if (!room) throw AppError.notFound("Room not found");

    const userObjectId = new Types.ObjectId(user._id);

    if (!room.participants.some((id) => id.equals(userObjectId))) {
      room.participants.push(userObjectId);
      await room.save();
    }

    const jitsiUser: JitsiUser = {
      _id: user._id.toString(),
      role: user.role,
      name: user.username || "Guest",
      email: user.email,
    };

    const token = generateJitsiToken(jitsiUser, room._id.toString());

    return { roomId: room._id.toString(), token };
  },

  // -------------------- LEAVE ROOM --------------------
  leaveRoom: async (roomId: string, userId: string) => {
    const room = await LiveRoomModel.findById(roomId);
    if (!room) throw AppError.notFound("Room not found");

    const userObjectId = new Types.ObjectId(userId);

    room.participants = room.participants.filter(
      (id) => !id.equals(userObjectId)
    );

    if (room.createdBy.equals(userObjectId)) {
      room.teacherOnline = false;
    }

    if (room.participants.length === 0) {
      room.status = "CLOSED";
      room.endedAt = new Date();
    }

    await room.save();
  },

  // -------------------- PING ROOM --------------------
  pingRoom: async (roomId: string, userId: string) => {
    const room = await LiveRoomModel.findById(roomId);
    if (!room) throw AppError.notFound("Room not found");
    const userObjectId = new Types.ObjectId(userId);

    if (room.createdBy.equals(userObjectId)) {
      room.lastSeenTeacher = new Date();
      room.teacherOnline = true;
      await room.save();
    }
  },

  // -------------------- CHECK TEACHER TIMEOUT --------------------
  checkTeacherTimeout: async () => {
    const timeout = 90 * 1000;
    const now = new Date();

    await LiveRoomModel.updateMany(
      {
        teacherOnline: true,
        lastSeenTeacher: { $lt: new Date(now.getTime() - timeout) },
      },
      { teacherOnline: false }
    );
  },
};
