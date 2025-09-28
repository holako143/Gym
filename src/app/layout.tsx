import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'متتبع التمارين الذكي',
  description: 'منصة تدريب ذكية تعمل دون اتصال بالإنترنت',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          as="style"
          href="https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
      </head>
      <body className="dark bg-brand-dark">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}