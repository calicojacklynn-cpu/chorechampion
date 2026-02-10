'use client';

import { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function BroadcastPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const handleSendBroadcast = () => {
    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Message cannot be empty',
        description: 'Please write a message to broadcast.',
      });
      return;
    }

    // In a real app, you would send this message to the champions.
    console.log('Broadcasting message:', message);

    toast({
      title: 'Broadcast Sent!',
      description: 'Your message has been sent to all champions.',
    });
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-muted-foreground" />
            Family Broadcasts
          </h1>
          <p className="text-muted-foreground">
            Send a message to all champion devices simultaneously.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Compose Broadcast</CardTitle>
          <CardDescription>
            Your message will appear as a notification on all champions' devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendBroadcast}>
            <Send className="mr-2 h-4 w-4" />
            Send Broadcast
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
