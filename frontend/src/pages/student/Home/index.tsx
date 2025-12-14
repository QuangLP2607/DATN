import { useState } from "react";
import jitsiApi from "@/services/jitsiService";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

const Home = () => {
  const [roomData, setRoomData] = useState<{
    roomId: string;
    token: string;
  } | null>(null);
  const [showRoom, setShowRoom] = useState(false);

  const createRoom = async () => {
    try {
      const res = await jitsiApi.joinRoom({
        roomId: "69327684e66b478a1b63ee4c",
      });
      setRoomData(res);
      setShowRoom(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeRoom = () => {
    setShowRoom(false);
  };

  return (
    <div className={cx("home")}>
      {/* Nút nổi ở góc phải */}
      {!showRoom && (
        <button className={cx("start-call")} onClick={createRoom}>
          Bắt đầu
        </button>
      )}

      {/* Iframe phòng */}
      {showRoom && roomData && (
        <div className={cx("roomWrapper")}>
          <button className={cx("backButton")} onClick={closeRoom}>
            ← Quay lại
          </button>
          {!roomData.roomId ? (
            <div className={cx("loading")}>Đang tạo phòng...</div>
          ) : (
            <iframe
              src={`https://elearningjpn.duckdns.org/${roomData.roomId}?jwt=${roomData.token}`}
              allow="camera; microphone; fullscreen; display-capture"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
