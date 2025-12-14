import { useEffect, useRef } from "react";

interface JitsiCallProps {
  roomName: string;
  displayName: string;
  jwt: string;
}

export default function JitsiCall({
  roomName,
  displayName,
  jwt,
}: JitsiCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).JitsiMeetExternalAPI || !containerRef.current) return;

    const domain = "52.221.186.219";
    const options = {
      roomName,
      parentNode: containerRef.current,
      userInfo: { displayName },
      jwt,
      width: "100%",
      height: 600,
    };

    // @ts-ignore
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose();
    };
  }, [roomName, displayName, jwt]);

  return <div ref={containerRef} style={{ width: "100%", height: 600 }} />;
}
