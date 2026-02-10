'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { TextareaProps } from '@/components/ui/textarea';

interface SpeechToTextInputProps extends Omit<TextareaProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function SpeechToTextInput({
  value,
  onChange,
  disabled,
  ...props
}: SpeechToTextInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Set to false to get a single final result
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Append the transcript to the existing value
        onChange(value ? `${value} ${transcript}` : transcript);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
    
    return () => {
      // Cleanup: stop recognition when the component unmounts
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [value, onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start recognition (might be already active):", e);
        setIsListening(false); // Reset state
      }
    }
  };
  
  if (!isSupported) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pr-12"
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          'absolute right-2 top-2 h-8 w-8 rounded-full transition-colors',
          isListening ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground'
        )}
        title="Use voice input"
      >
        <Mic className="h-4 w-4" />
        {isListening && (
          <>
            <span className="speech-animation-bubble" style={{ '--bubble-index': 1 } as React.CSSProperties}></span>
            <span className="speech-animation-bubble" style={{ '--bubble-index': 2 } as React.CSSProperties}></span>
            <span className="speech-animation-bubble" style={{ '--bubble-index': 3 } as React.CSSProperties}></span>
          </>
        )}
      </Button>
    </div>
  );
}
