export interface ILiveRoom {
  name: string;
  classId: string;
  createdBy: string;
  status: "OPEN" | "CLOSED";
  startedAt: Date;
  endedAt?: Date;
}
