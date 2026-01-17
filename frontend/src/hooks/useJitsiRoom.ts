import { useState, useEffect, useRef } from "react";
import jitsiApi, { type JitsiRoomResponse } from "@/services/jitsiService";

export function useJitsiRoom(room_name: string, class_id: string) {
  const [roomData, setRoomData] = useState<JitsiRoomResponse | null>(null);
  const roomRef = useRef<JitsiRoomResponse | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!room_name || !class_id) return;
    let mounted = true;

    const init = async () => {
      try {
        const res = await jitsiApi.createRoom({ room_name, class_id });
        if (!mounted) return;
        setRoomData(res);
        roomRef.current = res;
      } catch (err) {
        console.error("Lỗi khi tạo phòng:", err);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [room_name, class_id]);

  useEffect(() => {
    if (!roomRef.current) return;

    // ping teacher mỗi 30s
    intervalRef.current = window.setInterval(() => {
      if (roomRef.current)
        jitsiApi.pingRoom({ roomId: roomRef.current.roomId });
    }, 30000);

    const handleBeforeUnload = () => {
      if (roomRef.current) {
        navigator.sendBeacon(
          "/live-room/leave",
          JSON.stringify({ roomId: roomRef.current.roomId })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (roomRef.current)
        jitsiApi.leaveRoom({ roomId: roomRef.current.roomId });
    };
  }, []);

  return {
    roomData,
    leaveRoom: () =>
      roomRef.current && jitsiApi.leaveRoom({ roomId: roomRef.current.roomId }),
  };
}
