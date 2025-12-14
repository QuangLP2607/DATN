import classNames from "classnames/bind";
import styles from "./Chat.module.scss";

const cx = classNames.bind(styles);

const Chat = () => {
  return <div className={cx("chat")}>chat</div>;
};

export default Chat;
