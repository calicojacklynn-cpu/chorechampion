'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Megaphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';

type Message = {
    id: string;
    senderId: string;
    senderName: string;
    avatarId?: string;
    avatarUrl?: string;
    text: string;
    timestamp: string;
}

const initialMessages: Message[] = [];

export default function BroadcastPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }

    const messageToSend: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.uid || 'parent',
      senderName: user?.displayName || 'Parent',
      avatarUrl: user?.photoURL || '',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setMessages([...messages, messageToSend]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Megaphone className="h-8 w-8" />
            Family Chat
          </h1>
          <p className="text-muted-foreground">
            The community chat center for your family.
          </p>
        </div>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((message) => {
              const avatarPlaceholder = message.avatarId ? PlaceHolderImages.find(p => p.id === message.avatarId) : null;
              const imageUrl = message.avatarUrl || avatarPlaceholder?.imageUrl;
              const imageHint = avatarPlaceholder?.imageHint;
              const altText = avatarPlaceholder?.description || message.senderName;
              const isParent = message.senderId === user?.uid || message.senderId === 'parent';

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${isParent ? '' : 'justify-end'}`}
                >
                  {isParent && (
                    <Avatar className="h-10 w-10 border-2 border-black">
                      <AvatarImage src={imageUrl} data-ai-hint={imageHint} alt={altText} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md rounded-xl px-4 py-3 border border-black ${
                      isParent
                        ? 'bg-primary text-primary-foreground rounded-tl-none'
                        : 'bg-primary text-primary-foreground rounded-tr-none'
                    }`}
                  >
                    <p className={'font-bold text-sm mb-1'}>{message.senderName}</p>
                    <p>{message.text}</p>
                     <p className={`text-xs mt-2 opacity-70 ${isParent ? 'text-left' : 'text-right'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                   {!isParent && (
                    <Avatar className="h-10 w-10 border-2 border-black">
                      <AvatarImage src={imageUrl} data-ai-hint={imageHint} alt={altText} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="bg-muted rounded-full p-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">No messages yet</p>
                <p className="text-sm text-muted-foreground">Broadcast a message to your family champions!</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t bg-background/95 backdrop-blur-sm">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type a message..."
              className="resize-none flex-1"
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} size="icon" className="shrink-0" variant="default">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
