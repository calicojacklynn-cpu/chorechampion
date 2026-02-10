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

// Mock messages for demonstration
const initialMessages = [
  {
    id: 'msg-1',
    senderId: 'parent',
    senderName: 'Parent',
    avatarId: 'user-avatar-parent',
    text: "Don't forget, the Chore Champion of the week will be announced in 10 minutes!",
    timestamp: '10:30 AM',
  },
  {
    id: 'msg-2',
    senderId: 'alex',
    senderName: 'Alex',
    avatarId: 'champion-alex',
    text: "I hope it's me! I finished all my quests.",
    timestamp: '10:31 AM',
  },
  {
    id: 'msg-3',
    senderId: 'bella',
    senderName: 'Bella',
    avatarId: 'champion-bella',
    text: "Me too! Good luck! 🍀",
    timestamp: '10:32 AM',
  },
];

export default function BroadcastPage() {
  const [messages, setMessages] = useState(initialMessages);
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

    const messageToSend = {
      id: `msg-${Date.now()}`,
      senderId: 'parent',
      senderName: 'Parent',
      avatarId: 'user-avatar-parent',
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
            <Megaphone className="h-8 w-8 text-muted-foreground" />
            Family Chat
          </h1>
          <p className="text-muted-foreground">
            The community chat center for your family.
          </p>
        </div>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((message) => {
            const avatar = PlaceHolderImages.find(p => p.id === message.avatarId);
            const isParent = message.senderId === 'parent';

            return (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${!isParent ? 'justify-end' : ''}`}
              >
                {isParent && (
                  <Avatar className="h-10 w-10 border">
                    {avatar && <AvatarImage asChild src={avatar.imageUrl} alt={avatar.description}><Image src={avatar.imageUrl} width={40} height={40} data-ai-hint={avatar.imageHint} alt={avatar.description} /></AvatarImage>}
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-xl px-4 py-3 ${
                    isParent
                      ? 'bg-primary text-primary-foreground rounded-tl-none'
                      : 'bg-muted text-foreground rounded-tr-none'
                  }`}
                >
                  <p className={'font-bold text-sm mb-1'}>{message.senderName}</p>
                  <p>{message.text}</p>
                   <p className={`text-xs mt-2 opacity-70 ${!isParent ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                  </p>
                </div>
                 {!isParent && (
                  <Avatar className="h-10 w-10 border">
                    {avatar && <AvatarImage asChild src={avatar.imageUrl} alt={avatar.description}><Image src={avatar.imageUrl} width={40} height={40} data-ai-hint={avatar.imageHint} alt={avatar.description} /></AvatarImage>}
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
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
            <Button onClick={handleSendMessage} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
