export interface CreateRoomInput {
  name: string;
}

export interface JitsiRoomResponse {
  roomId: string;
  token: string;
}

export interface JoinRoomInput {
  roomId: string;
}
