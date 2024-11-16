import { useCallback, useEffect, useState } from "react";

import { Container, Flex, Progress } from "@radix-ui/themes";

import { useAudioRecorder } from "../../hooks/use-audio-recorder";
import { useTextToSpeech } from "../../hooks/use-text-to-speech";
import { AudioPlayer, RecordButton, StatusDisplay } from "../";

const SpeechRecorder = ({ sessionId, isEnabled = true }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [progress, setProgress] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  const {
    isRecording,
    hasPermission,
    permissionError,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const {
    audioRef,
    audioUrl,
    isAudioPlaying,
    convertTextToSpeech,
    resetAudio,
    audioEventHandlers,
  } = useTextToSpeech();

  // Mikrofon durumunu kontrol et
  const checkMicrophoneStatus = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setRecordingError(null);
    } catch (error) {
      console.error("Microphone check error:", error);
      setRecordingError(error.message);
    }
  }, []);

  useEffect(() => {
    checkMicrophoneStatus();
  }, [checkMicrophoneStatus]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => (prev + 1) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleMouseDown = async (e) => {
    e.preventDefault();
    setRecordingError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError("Microphone access is not supported in this browser");
      return;
    }

    if (e.button === 0 && !isProcessing && isEnabled) {
      try {
        setResponse("");
        await startRecording();
      } catch (error) {
        console.error("Start recording error:", error);
        setRecordingError(error.message);
      }
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      if (!audioBlob) return;

      setIsProcessing(true);
      resetAudio();

      const result = await sendAudioToBackend(audioBlob, sessionId);

      if (result?.success && result?.data) {
        setResponse(result.data.response);
        if (result.data.apiKey) {
          await convertTextToSpeech(result.data.response, result.data.apiKey);
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
      setResponse(
        error instanceof Error
          ? error.message
          : "An error occurred while processing audio"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isRecording) {
        handleStopRecording();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isRecording]);

  return (
    <Container
      size="4"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="6"
        style={{
          width: "100%",
          maxWidth: "500px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isProcessing || isAudioPlaying ? (
            <StatusDisplay
              isProcessing={isProcessing}
              isAudioPlaying={isAudioPlaying}
              response={response}
            />
          ) : (
            <RecordButton
              isRecording={isRecording}
              hasPermission={hasPermission && isEnabled && !recordingError}
              permissionError={permissionError || recordingError}
              isProcessing={isProcessing}
              onMouseDown={handleMouseDown}
            />
          )}
          {isRecording && (
            <Progress
              value={progress}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "160px",
                height: "160px",
                borderRadius: "100%",
                transform: "translate(-50%, -50%) rotate(-90deg)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {audioUrl && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <AudioPlayer
              ref={audioRef}
              src={audioUrl}
              {...audioEventHandlers}
            />
          </div>
        )}
      </Flex>
    </Container>
  );
};

export default SpeechRecorder;
