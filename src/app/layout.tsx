
import type { Metadata } from 'next';
import './globals.css';
import './themes/index.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/app/context/ThemeContext';

export const metadata: Metadata = {
  title: 'QuestKind',
  description: "Manage your family's quests with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
