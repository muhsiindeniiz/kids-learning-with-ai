import { useCallback, useEffect, useState } from "react";

export const useAudioPermission = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionError, setPermissionError] = useState("");

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setPermissionError("");
      return true;
    } catch (error) {
      console.error("Permission request error:", error);
      setHasPermission(false);
      setPermissionError("Please allow microphone access");
      return false;
    }
  }, []);

  useEffect(() => {
    const checkInitialPermission = async () => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices) {
        setHasPermission(false);
        setPermissionError("Browser does not support audio recording");
        return;
      }

      try {
        await requestPermission();
      } catch (error) {
        console.error("Initial permission check error:", error);
      }
    };

    checkInitialPermission();
  }, [requestPermission]);

  return {
    hasPermission,
    permissionError,
    requestPermission,
  };
};
