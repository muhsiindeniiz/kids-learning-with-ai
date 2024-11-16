import { useEffect, useState } from "react";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "@radix-ui/themes";
import { Mic, MicOff } from "lucide-react";

const RecordButton = ({
  isRecording,
  hasPermission,
  isProcessing,
  permissionError,
  onMouseDown,
}) => {
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const isDisabled = isProcessing || !hasPermission;

  useEffect(() => {
    const checkMicrophoneAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMicrophone = devices.some(
          (device) => device.kind === "audioinput"
        );
        setIsMicAvailable(hasMicrophone);
      } catch (error) {
        console.error("Error checking microphone:", error);
        setIsMicAvailable(false);
      }
    };

    checkMicrophoneAvailability();
  }, []);

  const buttonContent = (
    <Button
      size="4"
      style={{
        width: "160px",
        height: "160px",
        borderRadius: "100%",
        transform: isRecording ? "scale(1.1)" : "scale(1)",
        transition: "all 0.2s ease",
        background: isRecording ? "var(--red-a9)" : "var(--blue-a9)",
        opacity: isDisabled ? 0.7 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
      onMouseDown={!isDisabled ? onMouseDown : undefined}
      disabled={isDisabled}
    >
      {isRecording ? (
        <Mic
          size={64}
          color="white"
          style={{ animation: "pulse 2s infinite" }}
        />
      ) : (
        <MicOff size={64} color="white" />
      )}
    </Button>
  );

  if (permissionError || !isMicAvailable) {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{buttonContent}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {permissionError || "Microphone not available"}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return buttonContent;
};

export default RecordButton;
