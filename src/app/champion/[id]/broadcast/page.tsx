
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Megaphone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import type { Champion } from '@/app/dashboard/champions/page';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  senderRole: 'parent' | 'champion';
  text: string;
  timestamp: string;
};

export default function ChampionBroadcastPage() {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const firestore = useFirestore();
  const { user } = useUser();
  const params = useParams();
  const championId = typeof params.id === 'string' ? params.id : '';

  const championDocRef = useMemoFirebase(() => {
    if (!firestore || !championId) return null;
    return doc(firestore, 'champions', championId);
  }, [firestore, championId]);

  const { data: champion, isLoading: isChampionLoading } = useDoc<Champion>(championDocRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !champion?.parentId) return null;
    return query(
        collection(firestore, 'users', champion.parentId, 'messages'),
        orderBy('timestamp', 'asc'),
        limit(50)
    );
  }, [firestore, champion?.parentId]);

  const { data: messages, isLoading: isMessagesLoading } = useCollection<Message>(messagesQuery);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !champion || !firestore) {
      return;
    }

    const colRef = collection(firestore, 'users', champion.parentId, 'messages');
    addDocumentNonBlocking(colRef, {
      senderId: champion.id,
      senderName: champion.name,
      senderAvatarUrl: champion.avatarUrl || '',
      senderRole: 'champion',
      text: newMessage,
      timestamp: new Date().toISOString(),
    });

    setNewMessage('');
  };

  if (isChampionLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
          {isMessagesLoading ? (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((message) => {
              const isSelf = champion && message.senderId === champion.id;

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${isSelf ? 'justify-end' : ''}`}
                >
                  {!isSelf && (
                    <Avatar className="h-10 w-10 border-2 border-black">
                      <AvatarImage src={message.senderAvatarUrl} alt={message.senderName} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md rounded-xl px-4 py-3 border border-black ${
                      isSelf
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card text-card-foreground rounded-bl-none'
                    }`}
                  >
                    <p className={'font-bold text-sm mb-1'}>{message.senderName}</p>
                    <p>{message.text}</p>
                    <p
                      className={`text-[10px] mt-2 opacity-70 ${
                        isSelf ? 'text-right' : 'text-left'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isSelf && (
                    <Avatar className="h-10 w-10 border-2 border-black">
                      <AvatarImage src={message.senderAvatarUrl} alt={message.senderName} />
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
                <p className="text-sm text-muted-foreground">Start the conversation with your family!</p>
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
