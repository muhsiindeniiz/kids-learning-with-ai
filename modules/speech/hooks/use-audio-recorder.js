import { useCallback, useEffect, useRef, useState } from "react";

import { useAudioPermission } from "./use-audio-permission";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { hasPermission, permissionError, requestPermission } =
    useAudioPermission();

  const mediaRecorder = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const hasAccess = await requestPermission();
      if (!hasAccess) {
        throw new Error("Microphone permission denied");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      chunksRef.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Start recording error:", error);
      throw error;
    }
  }, [requestPermission]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (
        !mediaRecorder.current ||
        mediaRecorder.current.state === "inactive"
      ) {
        resolve(null);
        return;
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        mediaRecorder.current.stream
          .getTracks()
          .forEach((track) => track.stop());
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorder.current.stop();
    });
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    hasPermission,
    permissionError,
    startRecording,
    stopRecording,
  };
};
