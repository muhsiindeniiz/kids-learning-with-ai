import { useCallback, useEffect, useState } from "react";

export const useAudioPermission = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionError, setPermissionError] = useState("");

  const checkPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setPermissionError(
        "Microphone access is not supported in this browser or environment"
      );
      return;
    }

    try {
      // First try to get existing permission status
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: "microphone",
          });

          if (permissionStatus.state === "granted") {
            setHasPermission(true);
            setPermissionError("");
            return;
          }
        } catch (error) {
          console.log(
            "Permission query not supported, falling back to getUserMedia"
          );
        }
      }

      // If no existing permission or query not supported, try to get access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
        setPermissionError("");
      }
    } catch (error) {
      console.error("Permission check error:", error);
      setHasPermission(false);

      if (error.name === "NotAllowedError") {
        setPermissionError(
          "Please allow microphone access in your browser settings"
        );
      } else if (error.name === "NotFoundError") {
        setPermissionError("No microphone device found");
      } else if (error.name === "SecurityError") {
        setPermissionError(
          "Security error occurred while accessing microphone"
        );
      } else {
        setPermissionError("Failed to access microphone: " + error.message);
      }
    }
  }, []);

  useEffect(() => {
    // Initial permission check
    checkPermission();

    // Set up permission change listener if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            checkPermission();
          };
        })
        .catch((error) => {
          console.log("Permission status monitoring not supported");
        });
    }

    return () => {
      // Cleanup if needed
    };
  }, [checkPermission]);

  return {
    hasPermission,
    permissionError,
    checkPermission,
  };
};
