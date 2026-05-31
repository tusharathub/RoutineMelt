import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Outfit, Geist_Mono } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'RoutineMelt - Building habits, one routine at a time',
  description: 'A minimalist visual habit tracker in sand and red editorial theme.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${geistMono.variable}`}>
        <head>
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'sand';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          ` }} />
        </head>
        <body className="antialiased font-sans">
            {children}
        </body>
      </html>
    </ClerkProvider>
  )
}