import { useRef, useCallback, useState } from "react";

export const useWebSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connect = useCallback((userId, onMessage) => {
    return new Promise((resolve, reject) => {
      if (socketRef.current) {
        resolve(); // đã kết nối rồi
        return;
      }

      const socket = new WebSocket(
        `ws://localhost:8080/matching?userId=${userId}`
      );

      socket.onopen = () => {
        console.log("✅ WebSocket connected!");
        setIsConnected(true);
        setIsLoading(true);
        resolve(); // ✅ báo là đã kết nối xong
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Received:", data);
        onMessage(data);
      };

      socket.onerror = (event) => {
        console.error("🔥 WebSocket error event:", event);
        reject(event); // ❌ báo lỗi
      };

      socket.onclose = () => {
        console.log("❌ WebSocket disconnected.");
        setIsConnected(false);
      };

      socketRef.current = socket;
    });
  }, []);

  const disconnect = () => {
    console.log("click disconnect");
    if (socketRef.current) {
      setIsLoading(false);
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  return { connect, disconnect, isConnected, isLoading };
};
