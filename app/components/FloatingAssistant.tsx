"use client";

import { useState } from "react";

import AssistantChat from "./AssistantChat";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant" | "system"; content: string }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setUnreadCount(0);
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="relative">
            {unreadCount > 0 ? (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d0b12] shadow">
                {unreadCount}
              </span>
            ) : null}
            <Button aria-label="Open assistant chat">Chat</Button>
          </div>
        </DialogTrigger>
        <DialogContent
          forceMount
          className="h-[90vh] w-[92vw] max-w-[440px] rounded-2xl md:h-[680px] md:w-[440px]"
        >
          <DialogHeader>
            <DialogDescription>Assistant</DialogDescription>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle>Ask Mailo AI</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" aria-label="Close chat">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="h-[calc(90vh-60px)] overflow-hidden md:h-[620px]">
            <AssistantChat
              messages={messages}
              onMessagesChange={setMessages}
              onAssistantComplete={() => {
                if (!open) {
                  setUnreadCount((prev) => prev + 1);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
