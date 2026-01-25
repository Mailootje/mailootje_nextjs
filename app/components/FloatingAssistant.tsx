"use client";

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
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button aria-label="Open assistant chat">Chat</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] w-[92vw] max-w-[440px] rounded-2xl md:h-[680px] md:w-[440px]">
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
            <AssistantChat />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
