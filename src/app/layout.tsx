import './globals.css';
import type { Metadata } from 'next';
import EmotionRegistry from '@/theme/EmotionRegistry';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Gym Tracker PWA',
  description: 'A bodybuilding PWA that works completely offline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EmotionRegistry>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </EmotionRegistry>
      </body>
    </html>
  );
}