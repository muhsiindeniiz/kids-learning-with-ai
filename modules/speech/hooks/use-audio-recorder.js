import { useCallback, useEffect, useState } from "react";

const DEFAULT_AUDIO_SETTINGS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export const useAudioRecorder = () => {
  const [state, setState] = useState({
    isRecording: false,
    hasPermission: false,
    permissionError: null,
    recordingDuration: 0,
  });

  const [recorder] = useState(() => ({
    instance: null,
    chunks: [],
    stream: null,
    recordingStartTime: null,
  }));

  const checkPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState((prev) => ({
        ...prev,
        hasPermission: false,
        permissionError: "Microphone access is not supported in this browser",
      }));
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: DEFAULT_AUDIO_SETTINGS,
      });

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setState((prev) => ({
          ...prev,
          hasPermission: true,
          permissionError: null,
        }));
        return true;
      }
    } catch (error) {
      console.error("Permission check error:", error);
      setState((prev) => ({
        ...prev,
        hasPermission: false,
        permissionError: error.message,
      }));
      return false;
    }
  }, []);

  const initializeMediaStream = useCallback(
    async (settings = DEFAULT_AUDIO_SETTINGS) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser");
      }

      if (recorder.stream) {
        recorder.stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: settings,
        });
        recorder.stream = newStream;
        return newStream;
      } catch (error) {
        console.error("Error accessing microphone:", error);
        await checkPermission();
        throw error;
      }
    },
    [recorder, checkPermission]
  );

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        throw new Error("No microphone permission");
      }

      const audioStream = await initializeMediaStream();
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      });

      recorder.chunks = [];
      recorder.recordingStartTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recorder.chunks.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setState((prev) => ({
          ...prev,
          isRecording: true,
          recordingDuration: 0,
        }));
      };

      recorder.instance = mediaRecorder;
      mediaRecorder.start(1000);
    } catch (error) {
      console.error("Start recording error:", error);
      setState((prev) => ({
        ...prev,
        permissionError: error.message,
      }));
      throw error;
    }
  }, [recorder, initializeMediaStream, checkPermission]);

  const stopRecording = useCallback(async () => {
    if (!recorder.instance || !state.isRecording) return null;

    return new Promise((resolve) => {
      recorder.instance.onstop = () => {
        const duration = (Date.now() - recorder.recordingStartTime) / 1000;
        setState((prev) => ({
          ...prev,
          isRecording: false,
          recordingDuration: duration,
        }));

        const audioBlob = new Blob(recorder.chunks, {
          type: "audio/webm;codecs=opus",
        });
        resolve(audioBlob);
      };

      recorder.instance.stop();

      setTimeout(() => {
        if (recorder.stream) {
          recorder.stream.getTracks().forEach((track) => track.stop());
          recorder.stream = null;
        }
      }, 100);
    });
  }, [recorder, state.isRecording]);

  useEffect(() => {
    checkPermission();
    return () => {
      if (recorder.stream) {
        recorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [checkPermission, recorder]);

  return {
    isRecording: state.isRecording,
    hasPermission: state.hasPermission,
    permissionError: state.permissionError,
    recordingDuration: state.recordingDuration,
    startRecording,
    stopRecording,
    checkPermission,
  };
};
