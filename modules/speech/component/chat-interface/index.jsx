import { useEffect, useState } from "react";

import { Box, Flex, Text } from "@radix-ui/themes";

import { THEME } from "../../constant/styles";
import { useChat } from "../../hooks/useChat";
import ChatDialog from "../chat-dialog";
import Sidebar from "../sidebar";
import SpeechRecorder from "../speech-recorder";
import StartChatButton from "../start-chat";

const ChatInterface = () => {
  const {
    sessions,
    currentSession,
    selectedSessionMessages,
    isDialogOpen,
    showRecorder,
    error,
    startNewSession,
    fetchSessionMessages,
    setIsDialogOpen,
  } = useChat();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleStartChat = async () => {
    try {
      await startNewSession();
    } catch (error) {
      console.error("Failed to start new session:", error);
    }
  };

  return (
    <Flex width="100%">
      <Sidebar
        sessions={sessions}
        onSessionClick={fetchSessionMessages}
        currentSession={currentSession}
      />

      <Box
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flex
          direction="column"
          justify="center"
          width="100%"
          p="6"
          position="relative"
        >
          {error && (
            <Box
              position="absolute"
              top="4"
              left="50%"
              style={{
                transform: "translateX(-50%)",
                background: "rgba(255,0,0,0.1)",
                padding: "12px 24px",
                borderRadius: "8px",
                backdropFilter: "blur(8px)",
                zIndex: 10,
              }}
            >
              <Text style={{ color: THEME.colors.text.error }}>{error}</Text>
            </Box>
          )}

          <Flex align="center" justify="center" width="100%">
            {!showRecorder ? (
              <StartChatButton
                onClick={handleStartChat}
                disabled={!isInitialized}
              />
            ) : (
              <SpeechRecorder
                sessionId={currentSession}
                onRecordingComplete={() => {
                  fetchSessionMessages(currentSession);
                }}
              />
            )}
          </Flex>
        </Flex>
      </Box>

      <ChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        messages={selectedSessionMessages}
      />
    </Flex>
  );
};

export default ChatInterface;
