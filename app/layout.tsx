import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  description: 'A modern airline booking demo built with Next.js Cache Components and Partial Prefetching.',
  title: {
    default: 'Waypoint',
    template: '%s · Waypoint',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: '#f4f6f3', media: '(prefers-color-scheme: light)' },
    { color: '#071019', media: '(prefers-color-scheme: dark)' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
