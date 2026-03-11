import type { Metadata } from 'next';
import './globals.css';
import './themes/index.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/app/context/ThemeContext';

export const metadata: Metadata = {
  title: 'QuestKind',
  description: "Manage your family's quests with ease.",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  themeColor: '#3B82F6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
          <FirebaseClientProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
