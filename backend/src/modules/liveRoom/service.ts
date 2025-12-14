import LiveRoomModel from "@/models/LiveRoom";
import { generateJitsiToken, JitsiUser } from "@/services/jitsi";
import { CreateLiveRoomInput, JoinLiveRoomInput } from "./dto/liveRoom";

export const createRoomService = async (
  input: CreateLiveRoomInput,
  user: any
) => {
  const room = await LiveRoomModel.create({
    name: input.name,
    classId: user.id,
    createdBy: user.id,
  });

  const jitsiUser = {
    _id: user.userId,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const token = generateJitsiToken(jitsiUser, room._id.toString());

  return { roomId: room._id.toString(), token };
};

export const joinRoomService = async (input: JoinLiveRoomInput, user: any) => {
  const room = await LiveRoomModel.findById(input.roomId);
  if (!room) throw new Error("Room not found");

  const jitsiUser: JitsiUser = {
    _id: user.userId,
    role: user.role,
    name: user.email || "Guest",
    email: user.email,
  };

  const token = generateJitsiToken(jitsiUser, room._id.toString());

  return { roomId: room._id.toString(), token };
};
