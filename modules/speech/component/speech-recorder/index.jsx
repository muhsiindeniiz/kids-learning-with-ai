import { useEffect, useState } from "react";

import { Container, Flex, Progress, Text } from "@radix-ui/themes";

import { useAudioRecorder } from "../../hooks/use-audio-recorder";
import { useTextToSpeech } from "../../hooks/use-text-to-speech";
import { AudioPlayer, RecordButton, StatusDisplay } from "../";

const sendAudioToBackend = async (blob, sessionId) => {
  try {
    if (!blob || !sessionId) return null;

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

const SpeechRecorder = ({ sessionId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => (prev + 1) % 100);
      }, 50);
    }
    return () => interval && clearInterval(interval);
  }, [isRecording]);

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
      setError(null);
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
      setError(error.message);
      setResponse(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMouseDown = async (e) => {
    e.preventDefault();
    if (e.button === 0 && !isProcessing && hasPermission && !isRecording) {
      try {
        setError(null);
        setResponse("");
        await startRecording();
      } catch (error) {
        console.error("Start recording error:", error);
        setError("Failed to start recording");
      }
    }
  };

  return (
    <Container size="4" style={{ height: "100vh" }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="6"
        style={{ height: "100%" }}
      >
        <div style={{ position: "relative" }}>
          {error && (
            <Text
              color="red"
              size="2"
              style={{
                position: "absolute",
                top: -30,
                width: "100%",
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          )}

          {isProcessing || isAudioPlaying ? (
            <StatusDisplay
              isProcessing={isProcessing}
              isAudioPlaying={isAudioPlaying}
              response={response}
            />
          ) : (
            <RecordButton
              isRecording={isRecording}
              hasPermission={hasPermission}
              permissionError={permissionError}
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
          <AudioPlayer ref={audioRef} src={audioUrl} {...audioEventHandlers} />
        )}
      </Flex>
    </Container>
  );
};

export default SpeechRecorder;
