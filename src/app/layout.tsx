import './globals.css';
import type { Metadata } from 'next';
import EmotionRegistry from '@/theme/EmotionRegistry';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'متتبع التمارين الرياضية',
  description: 'تطبيق ويب تقدمي لكمال الأجسام يعمل بالكامل بدون انترنت',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
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