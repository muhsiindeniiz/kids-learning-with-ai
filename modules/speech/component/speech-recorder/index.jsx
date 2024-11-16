import { useCallback, useEffect, useState } from "react";

import { Container, Flex, Progress } from "@radix-ui/themes";

import { useAudioRecorder } from "../../hooks/use-audio-recorder";
import { useTextToSpeech } from "../../hooks/use-text-to-speech";
import { AudioPlayer, RecordButton, StatusDisplay } from "../";

const sendAudioToBackend = async (blob, sessionId) => {
  try {
    const formData = new FormData();
    const audioFile = new File([blob], "audio.webm", {
      type: "audio/webm",
      lastModified: Date.now(),
    });

    formData.append("audio", audioFile);
    formData.append("sessionId", sessionId);

    const response = await fetch("/api/speech/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending audio:", error);
    throw error;
  }
};

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

  // Recording Progress
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => (prev + 1) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Mouse events
  useEffect(() => {
    const handleMouseUp = () => {
      if (isRecording) {
        handleStopRecording();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isRecording]);

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
          try {
            await convertTextToSpeech(result.data.response, result.data.apiKey);
          } catch (error) {
            console.error("Text to speech error:", error);
          }
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

  const handleMouseDown = async (e) => {
    e.preventDefault();
    if (
      e.button === 0 &&
      !isProcessing &&
      hasPermission &&
      !isRecording &&
      isEnabled
    ) {
      try {
        setResponse("");
        setRecordingError(null);
        await startRecording();
      } catch (error) {
        console.error("Start recording error:", error);
        setRecordingError(error.message);
      }
    }
  };

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
