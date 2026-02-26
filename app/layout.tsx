import type { Metadata, Viewport } from 'next'
import { Raleway, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CadSocial - Cadastro de Programas Sociais',
  description: 'Sistema de cadastro e gerenciamento de inscritos em programas sociais governamentais.',
  generator: 'v0.app',
  icons: {
    icon: '/icons8-brazil-48.png',
    apple: '/icons8-brazil-48.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${raleway.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
