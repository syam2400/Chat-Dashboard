"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "../../../../lib/api";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: string;
  seen?: boolean;
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

export default function ChatPage() {
  const { userId } = useParams(); // route: /chat/[userId]
  const router = useRouter();

  const [receiver, setReceiver] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getSession = () => {
    const raw =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");
    return raw ? JSON.parse(raw) : null;
  };

  const session = getSession();
  const token = session?.token;
  const myId = session?.userId || session?._id;

  // Fetch receiver user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReceiver(res?.data || null);

      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Fetch messages 
  useEffect(() => {
    const fetchMessages = async () => {
        const payload = {
                        receiverId: userId
                        };
      try {
        const res = await apiClient.post(`/api/chats/create`,
        payload,
         {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    if (userId) fetchMessages();
  }, [userId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const newMsg: Message = {
      senderId: myId,
      receiverId: userId as string,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    // Optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    try {
      await apiClient.post(
        `/api/messages/send`,
        { receiverId: userId, text: newMsg.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isMine = (msg: Message) => msg.senderId === myId;

  if (loading) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: "#eef2f7",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", md: "75%", lg: "65%" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            background: "linear-gradient(135deg,#1e3c72,#2a5298)",
            color: "white",
          }}
        >
          <IconButton onClick={() => router.push("/chat")} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>

          <Avatar
            src={receiver?.profileImage || ""}
            sx={{
              width: 46,
              height: 46,
              bgcolor: "#ffffff33",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            {!receiver?.profileImage &&
              (receiver?.name || "U").charAt(0).toUpperCase()}
          </Avatar>

          <Box flex={1}>
            <Typography fontWeight="bold" fontSize={16} lineHeight={1.2}>
              {receiver?.name || "Unknown"}
            </Typography>
            <Typography fontSize={12} sx={{ opacity: 0.75 }}>
              {receiver?.email}
            </Typography>
          </Box>

          {/* Online dot (static for now) */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#4cff91",
              boxShadow: "0 0 6px #4cff91",
              mr: 1,
            }}
          />
        </Box>

        {/* ── Messages ── */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 1.5, md: 3 },
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "#eef2f7",
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(42,82,152,0.05) 0%, transparent 60%),
                              radial-gradient(circle at 80% 80%, rgba(30,60,114,0.05) 0%, transparent 60%)`,
          }}
        >
          {messages.length === 0 && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.4,
                gap: 1,
              }}
            >
              <Typography fontSize={40}>💬</Typography>
              <Typography fontSize={14} color="text.secondary">
                No messages yet. Say hello!
              </Typography>
            </Box>
          )}

          {messages.map((msg, i) => {
            const mine = isMine(msg);
            return (
              <Box
                key={msg._id || i}
                sx={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                {/* Receiver avatar for their messages */}
                {!mine && (
                  <Avatar
                    src={receiver?.profileImage || ""}
                    sx={{ width: 30, height: 30, bgcolor: "#2a5298", fontSize: 13 }}
                  >
                    {(receiver?.name || "U").charAt(0).toUpperCase()}
                  </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: "68%",
                    px: 2,
                    py: 1.2,
                    borderRadius: mine
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background: mine
                      ? "linear-gradient(135deg,#1e3c72,#2a5298)"
                      : "linear-gradient(145deg,#ffffff,#e6e9f0)",
                    color: mine ? "white" : "text.primary",
                    boxShadow: mine
                      ? "0 4px 12px rgba(30,60,114,0.3)"
                      : "3px 3px 10px rgba(0,0,0,0.08),-3px -3px 10px rgba(255,255,255,0.7)",
                    position: "relative",
                  }}
                >
                  <Typography fontSize={14} lineHeight={1.5}>
                    {msg.text}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 0.4,
                      mt: 0.3,
                    }}
                  >
                    <Typography
                      fontSize={10}
                      sx={{ opacity: mine ? 0.75 : 0.5 }}
                    >
                      {formatTime(msg.createdAt)}
                    </Typography>
                    {mine && (
                      <DoneAllIcon
                        sx={{
                          fontSize: 13,
                          opacity: 0.75,
                          color: msg.seen ? "#4cff91" : "inherit",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Box>

        {/* ── Input Bar ── */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton sx={{ color: "#2a5298" }}>
            <EmojiEmotionsOutlinedIcon />
          </IconButton>

          <IconButton sx={{ color: "#2a5298" }}>
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            multiline
            maxRows={3}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: "#eef2f7",
                "& fieldset": { border: "none" },
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={!text.trim() || sending}
            sx={{
              background: "linear-gradient(135deg,#1e3c72,#2a5298)",
              color: "white",
              width: 44,
              height: 44,
              "&:hover": {
                background: "linear-gradient(135deg,#2a5298,#1e3c72)",
                transform: "scale(1.05)",
              },
              "&:disabled": { opacity: 0.4, background: "#ccc" },
              transition: "all 0.2s",
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
